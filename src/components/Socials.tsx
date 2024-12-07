'use client'

import React from 'react'
import { Link } from 'react-scroll'
import { FaGithub, FaDiscord, FaLinkedin } from 'react-icons/fa'
import { SiMedium } from 'react-icons/si'

export default function Socials(): React.ReactNode {
    return (
        <div className='fixed w-full h-[80px] flex justify-between items-center px-4 bg-[#0a192f] text-gray-300'>
            <div className='hidden lg:flex fixed flex-col top-[35%] left-0 '>
                <ul>
                    <li className='w-[160px] h-[60px] flex justify-between items-center ml-[-100px] hover:ml-[-10px] duration-300 bg-black'>
                        <a
                            className='flex justify-between items-center w-full text-gray-300'
                            href='https://github.com/CloudCommunityClub'
                            target='_blank'
                            rel='noreferrer'
                        >
                            GitHub <FaGithub size={30} />
                        </a>
                    </li>

                    <li className='w-[160px] h-[60px] flex justify-between items-center ml-[-100px] hover:ml-[-10px] duration-300 bg-[#7289d9]'>
                        <a
                            className='flex justify-between items-center w-full text-gray-300'
                            target='_blank'
                            rel='noreferrer'
                            href='https://discord.gg/YOUR_INVITE_CODE'
                        >
                            Discord <FaDiscord size={30} />
                        </a>
                    </li>

                    <li className='w-[160px] h-[60px] flex justify-between items-center ml-[-100px] hover:ml-[-10px] duration-300 bg-[#0A66C2]'>
                        <a
                            className='flex justify-between items-center w-full text-gray-300'
                            target='_blank'
                            rel='noreferrer'
                            href='https://www.linkedin.com/company/cloudcommunityclub'
                        >
                            LinkedIn <FaLinkedin size={30} />
                        </a>
                    </li>

                    <li className='w-[160px] h-[60px] flex justify-between items-center ml-[-100px] hover:ml-[-10px] duration-300 bg-black'>
                        <a
                            className='flex justify-between items-center w-full text-gray-300'
                            target='_blank'
                            rel='noreferrer'
                            href='https://medium.com/@c3club'
                        >
                            Blog <SiMedium size={30} />
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    )
}
