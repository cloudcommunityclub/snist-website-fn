import React from 'react'
import type { ReactNode } from 'react'

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
const pfp_vicepresident = dir_leaderPortraits + 'jonasquiballoport.png'
const pfp_secretary = dir_leaderPortraits + 'kailabautistaport.png'
const pfp_treasurer = dir_leaderPortraits + 'jayanpintorport.png'
const pfp_projectmanager = dir_leaderPortraits + 'lanceruizport.jpg'

const pfp_auxillary1 = dir_leaderPortraits + 'christseport.png'

const pfp_coadvisor1 = dir_leaderPortraits + 'denisehumport.png'
const pfp_coadvisor2 = dir_leaderPortraits + 'bryanswartoutport.png'
const pfp_none = dir_leaderPortraits + 'noprofile.webp'

export const FALLBACK_QUOTE = "Join us in shaping the future of cloud computing!"

type LeadershipRole = {
    role: string
    imgSrc: string
    quote?: ReactNode
    status?: string
}

type MinorRole = {
    label: string
    color_complex: string
}

export const leadership = {
    "Club President": {
        role: "To be announced",
        imgSrc: "/assets/leadership/placeholder.jpg",
        quote: "Leadership position opening soon!",
        status: "Coming Soon"
    },
    "Vice President": {
        role: "To be announced",
        imgSrc: "/assets/leadership/placeholder.jpg",
        quote: "Leadership position opening soon!",
        status: "Coming Soon"
    },
    "Cloud Infrastructure Lead": {
        role: "To be announced",
        imgSrc: "/assets/leadership/placeholder.jpg",
        quote: "Leadership position opening soon!",
        status: "Coming Soon"
    },
    "DevOps Lead": {
        role: "To be announced",
        imgSrc: "/assets/leadership/placeholder.jpg",
        quote: "Leadership position opening soon!",
        status: "Coming Soon"
    }
    
} as Record<string, LeadershipRole>

export default leadership
