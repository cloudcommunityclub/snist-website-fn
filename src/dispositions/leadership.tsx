/*

    ! NOTICE: Per leader dict entry, follow this key order. Leave each string value empty if not applicable.
        'role': 'Projects Manager',
        'imgSrc': pfp_projectmanager,
        'quote': (<p>This is for the record. History is written by the victor. History is filled with liars.</p>),
        SOCIALS START HERE
        'linktree': 'https://www.linktr.ee/devalto',
        'instagram': 'https://www.instagram.com/dev_alto',
        'discord': 'https://discordapp.com/users/691359092136083457',
        'github': 'https://www.github.com/dev-alto',
        'linkedin': 'https://www.linkedin.com/in/lance-ruiz',
        'website': 'https://the-devalto-experiments.000webhostapp.com/'

*/

// TODO prepare to add yearly leaderships

import { BiCrown } from 'react-icons/bi'
import { CgCrown } from 'react-icons/cg'

import { FaRegHandPeace } from 'react-icons/fa'
import { LuConstruction } from 'react-icons/lu'

import { PiFeatherDuotone, PiHandshakeBold } from 'react-icons/pi'

const dir_leaderPortraits = '/assets/home/leader_portraits/'

const pfp_nikhilanand = dir_leaderPortraits + 'nikhilanand.webp'
const pfp_vinay = dir_leaderPortraits + 'vinay.webp'
const pfp_shruthi = dir_leaderPortraits + 'shruthi.webp'
const pfp_vamanakhil = dir_leaderPortraits + 'vamanakhil.webp'
const pfp_himanshu = dir_leaderPortraits + 'himanshu.webp'
const pfp_premsai = dir_leaderPortraits + 'premsai.webp'
const pfp_pranavi = dir_leaderPortraits + 'pravnavi.webp'
const pfp_thanmayee = dir_leaderPortraits + 'thanmayee.webp'
const pfp_tharun = dir_leaderPortraits + 'tharun.webp'
const pfp_none = dir_leaderPortraits + 'noprofile.webp'
export const FALLBACK_QUOTE = (
    <p>
        That was no message. <i>This</i> is a message.
    </p>
)

export const leadership = {
    major: {
        'Nikhil Anand': {
            role: 'President',
            imgSrc: pfp_nikhilanand,
            quote: <p>The future is digital.</p>,
            instagram: 'https://www.instagram.com/_nikhillanand/',
            github: 'https://github.com/nikhilanandd',
            linkedin: 'https://www.linkedin.com/in/nikhil-anand-94948a25a/',
            icon: <BiCrown />,
        },
        'Vinay Kumar': {
            role: 'Vice President',
            imgSrc: pfp_vinay,
            quote: <p>Amplifying in the Digital Space</p>,
            github: 'https://github.com/VinayKumarVangala',
            linkedin: 'https://www.linkedin.com/in/vinay-kumar-vangala',
            website: 'https://vinaykumarvangala.github.io/',
            icon: <CgCrown />,
        },
        Shruthi: {
            role: 'General Secretary',
            imgSrc: pfp_shruthi,
            quote: <p>Build. Lead. Scale.</p>,
            github: 'https://github.com/Shruthi0719',
            linkedin: 'https://www.linkedin.com/in/rshruthiyadav',
            icon: <PiFeatherDuotone />,
        },
        Vaman: {
            role: 'Community Manager',
            imgSrc: pfp_vamanakhil,
            quote: <p>"Building bridges between ideas and innovation."</p>,
            instagram: 'https://www.instagram.com/vamanakhil/',
            github: 'https://github.com/Vamanakhil',
            linkedin: 'https://www.linkedin.com/in/vaman-akhil-b47604243/',
            website: 'https://akhilon.dev/',
            icon: <FaRegHandPeace />,
        },
        Amarnath: {
            role: 'Organizing Head',
            imgSrc: pfp_none,
            quote: '',
            icon: <PiHandshakeBold />,
        },
        'Prem Sai': {
            role: 'Technical Head',
            imgSrc: pfp_premsai,
            quote: 'wake up to reality.',
            instagram: 'https://www.instagram.com/iblameprems/',
            github: 'https://github.com/prem22k',
            linkedin: 'https://www.linkedin.com/in/premsai22k/',
            website: 'https://premsai.vercel.app/',
            icon: <LuConstruction />,
        },
        Himanshu: {
            role: 'Technical Head',
            imgSrc: pfp_himanshu,
            quote: (
                <p>
                    Building epic stuffs, Self-taught by shipping things on the
                    internet
                </p>
            ),
            github: 'https://github.com/himanshubijja',
            linkedin: 'https://linkedin.com/in/himanshubijja',
            website: 'https://www.himanshubijja.me/',
            icon: <LuConstruction />,
        },
        Pranavi: {
            role: 'Publicity Head',
            imgSrc: pfp_pranavi,
            quote: <p>Communicate with purpose.</p>,
            github: 'https://github.com/pranavivasala',
            linkedin: 'https://www.linkedin.com/in/pranavi-vasala-47aa78353/',
            icon: <PiHandshakeBold />,
        },
        Thanmayee: {
            role: 'Documentation Head',
            imgSrc: pfp_thanmayee,
            quote: <p>Fueling growth, one initiative at a time.</p>,
            github: 'https://github.com/thanmayeekotha27',
            linkedin: 'https://www.linkedin.com/in/thanmayee-kotha-1577842a8/',
            icon: <PiHandshakeBold />,
        },
        Tharun: {
            role: 'Designing Head',
            imgSrc: pfp_tharun,
            quote: <p>Exploring new cutting edge technologies...!</p>,
            github: 'https://github.com/tharun-maram',
            linkedin: 'https://www.linkedin.com/in/tharun-maram-226903326/',
            icon: <PiHandshakeBold />,
        },
    },
    minor: {},
}

export default leadership
