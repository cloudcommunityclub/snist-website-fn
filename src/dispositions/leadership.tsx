/*

    ! NOTICE: Per leader dict entry, follow this key order. Leave each string value empty if not applicable.
        'role': 'Projects Manager',
        'imgSrc': pfp_projectmanager,
        'quote': (<p>This is for the record. History is written by the victor. History is filled with liars.</p>),
        SOCIALS START HERE
        'linktree': 'https://www.linktr.ee/devalto',
        'instagram': 'https://www.instagram.com/dev_alto',
        'discord': 'https://discordapp.com/users/168406210687533056',
        'github': 'https://www.github.com/dev-alto',
        'linkedin': 'https://www.linkedin.com/in/lance-ruiz',
        'website': 'https://the-devalto-experiments.000webhostapp.com/'

*/

// TODO prepare to add yearly leaderships

import { BiCrown } from 'react-icons/bi'
import { CgCrown } from 'react-icons/cg'
import { GrMoney } from 'react-icons/gr'

import { FaRegHandPeace } from 'react-icons/fa'
import { LuConstruction } from 'react-icons/lu'

import { AiOutlineGlobal } from 'react-icons/ai'
import { MdOutlineEmojiEvents } from 'react-icons/md'

import { PiFeatherDuotone, PiHandshakeBold } from 'react-icons/pi'

const dir_leaderPortraits = '/assets/home/leader_portraits/'

const pfp_president = dir_leaderPortraits + 'tylerkuwadaport.png'
const pfp_vicepresident = dir_leaderPortraits + 'nikhilanand.png'
const pfp_secretary = dir_leaderPortraits + 'kailabautistaport.png'
const pfp_community = dir_leaderPortraits + 'jayanpintorport.png'
const pfp_technical = dir_leaderPortraits + 'lanceruizport.jpg'

const pfp_rdhead = dir_leaderPortraits + 'christseport.png'

const pfp_organizing = dir_leaderPortraits + 'denisehumport.png'
const pfp_designing = dir_leaderPortraits + 'bryanswartoutport.png'
const pfp_marketing = dir_leaderPortraits + 'bryanswartoutport.png'
const pfp_none = dir_leaderPortraits + 'noprofile.webp'

export const FALLBACK_QUOTE = (
    <p>
        That was no message. <i>This</i> is a message.
    </p>
)

export const leadership = {
    major: {
        'Tyler Kuwada': {
            role: 'President',
            imgSrc: pfp_president,
            quote: (
                <p>
                    Oh, these weren't homemade, they were made in a factory.
                    A bomb factory. They're bombs.
                </p>
            ),
            linktree: '',
            instagram: 'https://www.instagram.com/tyler_kuwada/',
            discord: 'https://discordapp.com/users/227633077545992192',
            icon: <BiCrown />,
        },
        'Jonas Quiballo': {
            role: 'Vice President',
            imgSrc: pfp_vicepresident,
            quote: <p>The future is digital.</p>,
            linktree: '',
            linkedin: 'https://www.linkedin.com/in/nikhil-anand-94948a25a/',
            instagram: 'https://www.instagram.com/_.waffly._/',
            icon: <CgCrown />,
        },
        'Vasala Harshitha': {
            role: 'General Secretary',
            imgSrc: pfp_secretary,
            quote: (
                <p>
                    Building, Breaking and Learning.
                </p>
            ),
            linktree: '',
            linkedin: 'https://www.linkedin.com/in/vasala-harshitha-bb15952a3/',
            icon: <PiFeatherDuotone />,
        },
        'Jayan Pintor': {
            role: 'Community Manager',
            imgSrc: pfp_community,
            quote: (
                <p>
                    We all live in a coded world of if-statements... never knowing
                    the conditions of each until interpretation.
                </p>
            ),
            linktree: '',
            github: 'https://github.com/CoderLearnerTime',
            linkedin: 'https://www.linkedin.com/in/jayanthony-pintor/',
            instagram: 'https://www.instagram.com/0p_photos/',
            website: 'https://www.jayanthonypintor.study',
            icon: <GrMoney />,
        },
        'Srinivas Gogula': {
            role: 'Technical Head',
            imgSrc: pfp_technical,
            quote: (
                <p>
                   First, solve the problem. Then, write the code.
                </p>
            ),
            linktree: 'https://www.linktr.ee/devalto',
            instagram: '',
            discord: 'https://discordapp.com/users/168406210687533056',
            github: 'https://www.github.com/dev-alto',
            linkedin: 'https://www.linkedin.com/in/lance-ruiz',
            website: 'https://the-devalto-experiments.000webhostapp.com/',
            icon: <LuConstruction />,
        },
        'Chris Tse': {
            role: 'Research & Development Head',
            imgSrc: pfp_rdhead,
            quote: ( 
                <p>
                    A true Isaiah Rashad fan.
                </p>
            ),
            linktree: 'https://linktr.ee/isaiahrashadfan',
            instagram: 'https://www.instagram.com/cchristse',
            discord: 'https://discordapp.com/users/85194740890337280',
            linkedin: 'https://www.linkedin.com/in/chris-tse-irf/',
            icon: <FaRegHandPeace />,
        },
        'Denise Hum': {
            role: 'Organizing Head',
            imgSrc: pfp_organizing,
            quote: 'Data are summaries of thousands of stories. Tell a few of those stories to help make the data meaningful.',
            linktree: '',
            discord: 'https://discordapp.com/users/735277805662765066',
            github: '',
            linkedin: 'https://www.linkedin.com/in/denisehum/',
            icon: <PiHandshakeBold />,
        },
        'T Siva Maruthi Ganesh': {
            role: 'Designing Head',
            imgSrc: pfp_designing,
            quote: 'One step at a time.',
            linktree: '',
            instagram: 'https://www.instagram.com/tsmg_125/',
            linkedin: 'https://www.linkedin.com/in/maruthi-ganesh-929988258/',
            icon: <PiHandshakeBold />,
        },
         'B Vasundara': {
             role: 'Marketing Head',
             imgSrc: pfp_marketing,
             quote: 'I’m not a psychopath, I’m a high-functioning sociopath ',
             linktree: '',
             instagram: 'https://www.instagram.com/bv_894?igsh=MXJvY2poMW9mcG53Nw==',
             github: '',
             linkedin: 'https://www.linkedin.com/in/b-vasundara-678b86253?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app',
             icon: <PiHandshakeBold />,
         },
    },
    minor: {
        'Web Master': {
            label: 'Prem Sai K',
            color_complex: 'from-[#1eb0b0] shadow-[#1eb0b0]',
            icon: <AiOutlineGlobal />,
        },
        'Social Outreach': {
            label: 'Chris Tse & Kaila Bautista',
            color_complex: 'from-[#651e94] shadow-[#651e94]',
            icon: <PiHandshakeBold />,
        },
        'Event Planners': {
            label: 'Tyler Kuwada & Lance Ruiz',
            color_complex: 'from-[#9c710c] shadow-[#9c710c]',
            icon: <MdOutlineEmojiEvents />,
        },
    },
}

export default leadership