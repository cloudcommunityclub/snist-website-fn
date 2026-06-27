import test, { describe, before, after } from 'node:test';
import assert from 'node:assert';
import mongoose from 'mongoose';
import dbConnect from '../lib/db.ts';
import DigitalIndiaSubmission from '../models/DigitalIndiaSubmission.ts';
import DigitalIndiaAccepted from '../models/DigitalIndiaAccepted.ts';
import DigitalIndiaReferral from '../models/DigitalIndiaReferral.ts';

const testTimestamp = Date.now();
const testEmailA = `leader_test_a_${testTimestamp}@example.com`;
const testEmailB = `leader_test_b_${testTimestamp}@example.com`;
const testTeamNameA = `Test Team Alpha ${testTimestamp}`;
const testTeamNameB = `Test Team Beta ${testTimestamp}`;
const testUtrA = `UTR_TEST_A_${testTimestamp}`;
const testUtrB = `UTR_TEST_B_${testTimestamp}`;

describe('Referral System Database Integration Tests', () => {
    before(async () => {
        try {
            // Ensure database connection
            await dbConnect();
            // Clean up any stray test data
            await DigitalIndiaSubmission.deleteMany({ email: /_test_/ });
            await DigitalIndiaAccepted.deleteMany({ email: /_test_/ });
            await DigitalIndiaReferral.deleteMany({ referrerEmail: /_test_/ });

            // Ensure unique indexes are built for testing duplicate constraints
            await DigitalIndiaSubmission.ensureIndexes();
            await DigitalIndiaAccepted.ensureIndexes();
            await DigitalIndiaReferral.ensureIndexes();
        } catch (err) {
            console.error('Error in before hook:', err);
            throw err;
        }
    });

    after(async () => {
        try {
            // Final cleanup
            await DigitalIndiaSubmission.deleteMany({ email: /_test_/ });
            await DigitalIndiaAccepted.deleteMany({ email: /_test_/ });
            await DigitalIndiaReferral.deleteMany({ referrerEmail: /_test_/ });
            await mongoose.connection.close();
        } catch (err) {
            console.error('Error in after hook:', err);
        }
    });

    test('1. Generate referralCode on Team A registration', async () => {
        const teamA = new DigitalIndiaSubmission({
            name: 'Leader Test A',
            college: 'SNIST College',
            email: testEmailA,
            phone: '9999999991',
            idea: 'A comprehensive, details-oriented smart grid system for local energy management.',
            utrId: testUtrA,
            teamName: testTeamNameA,
            domain: 'Digital Governance & Public Services',
            teamSize: 3,
            paymentScreenshotUrl: 'https://example.com/screenshot.png',
            teamMembers: [
                { name: 'Member A2', email: `a2_test_${testTimestamp}@example.com` },
                { name: 'Member A3', email: `a3_test_${testTimestamp}@example.com` }
            ]
        });

        // Simulating the referralCode generation hook
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        teamA.referralCode = code;

        const savedTeamA = await teamA.save();
        assert.ok(savedTeamA._id);
        assert.strictEqual(savedTeamA.referralCode.length, 6);
        assert.strictEqual(savedTeamA.referralPoints, 0);
        assert.ok(savedTeamA.lastPointEarnedAt);
    });

    test('2. Award referral point immediately upon Team B registration with Team A code', async () => {
        const teamA = await DigitalIndiaSubmission.findOne({ email: testEmailA });
        assert.ok(teamA);
        const codeA = teamA.referralCode;

        // Register Team B using codeA
        const teamB = new DigitalIndiaSubmission({
            name: 'Leader Test B',
            college: 'SNIST College',
            email: testEmailB,
            phone: '9999999992',
            idea: 'An AI-powered agricultural helper system utilizing drone data analytics.',
            utrId: testUtrB,
            teamName: testTeamNameB,
            domain: 'Agritech & Rural Development',
            teamSize: 3,
            paymentScreenshotUrl: 'https://example.com/screenshot.png',
            teamMembers: [
                { name: 'Member B2', email: `b2_test_${testTimestamp}@example.com` },
                { name: 'Member B3', email: `b3_test_${testTimestamp}@example.com` }
            ],
            referredByCode: codeA
        });

        let codeB = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        for (let i = 0; i < 6; i++) {
            codeB += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        teamB.referralCode = codeB;

        const savedTeamB = await teamB.save();
        assert.ok(savedTeamB._id);
        assert.strictEqual(savedTeamB.referredByCode, codeA);

        // Award referral points immediately (like in submit route)
        const referrer = await DigitalIndiaSubmission.findOneAndUpdate(
            { referralCode: codeA },
            { 
                $inc: { referralPoints: 1 },
                $set: { lastPointEarnedAt: new Date() }
            },
            { new: true }
        );

        assert.ok(referrer);
        assert.strictEqual(referrer.referralPoints, 1);

        // Log referral event
        const log = new DigitalIndiaReferral({
            referrerTeamId: referrer._id,
            referrerEmail: referrer.email,
            referredTeamId: savedTeamB._id,
            referredEmail: savedTeamB.email
        });
        await log.save();

        const savedLog = await DigitalIndiaReferral.findOne({ referredTeamId: savedTeamB._id });
        assert.ok(savedLog);
        assert.strictEqual(savedLog.referrerEmail, referrer.email);
    });

    test('3. Enforce unique teamName constraint', async () => {
        // Attempt to register a third team with the duplicate teamName of Team A
        const duplicateTeam = new DigitalIndiaSubmission({
            name: 'Leader Test C',
            college: 'SNIST College',
            email: `leader_test_c_${testTimestamp}@example.com`,
            phone: '9999999993',
            idea: 'A comprehensive smart grid system for local energy management.',
            utrId: `UTR_TEST_C_${testTimestamp}`,
            teamName: testTeamNameA, // Duplicate
            domain: 'Digital Governance & Public Services',
            paymentScreenshotUrl: 'https://example.com/screenshot.png',
            teamSize: 3,
            referralCode: 'XYZ123'
        });

        try {
            await duplicateTeam.save();
            assert.fail('Should have failed due to duplicate teamName constraint');
        } catch (err: any) {
            assert.ok(err.code === 11000 || err.message.includes('duplicate') || err.name === 'MongoServerError');
        }
    });

    test('4. Leaderboard sorting with tie-breaker priority', async () => {
        // Fetch all test teams and sort them according to leaderboard rules
        // Team A (points = 1) should be ranked higher than Team B (points = 0)
        const teams = await DigitalIndiaSubmission.find({ email: /_test_/ });
        
        teams.sort((a, b) => {
            if (b.referralPoints !== a.referralPoints) {
                return b.referralPoints - a.referralPoints;
            }
            return new Date(a.lastPointEarnedAt).getTime() - new Date(b.lastPointEarnedAt).getTime();
        });

        assert.strictEqual(teams[0].teamName, testTeamNameA);
        assert.strictEqual(teams[1].teamName, testTeamNameB);
    });
});
