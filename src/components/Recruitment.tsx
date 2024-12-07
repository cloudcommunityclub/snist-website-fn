'use client'

import { Element } from 'react-scroll'
import Image from 'next/image'
import { Cloud } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { SiGoogleforms } from 'react-icons/si'

export default function Recruitment(): React.ReactNode {
    return (
        <div className='w-full h-[220vh] relative overflow-hidden'>
            {/* top gradient */}
            <div className='absolute top-0 w-full h-[15%] bg-gradient-to-b from-black to-transparent' />
            {/* bottom gradient */}
            <div className='absolute bottom-0 w-full h-[30%] bg-gradient-to-t from-[#0a0a0a] to-transparent' />

            <Image
                src='/assets/backgrounds/cloud-bg.jpg'
                width={1600}
                height={1600}
                alt='Cloud computing background'
                className='-z-10 object-cover aspect-auto absolute w-full h-full opacity-[30%]'
                priority
            />

            <div className='w-full h-[110vh] flex absolute bottom-[12rem] flex-col gap-4 justify-center items-center'>
                <Cloud className="w-24 h-24 text-blue-400 animate-bounce" />

                <div className='pt-4 pb-10'>
                    <h1 className='title-main w-full text-center text-4xl font-semibold'>
                        <span className='text-blue-400 drop-shadow-[0_0_10px_rgba(50,150,250,0.45)]'>
                            Join C³.{' '}
                        </span>
                        <span className='text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.45)]'>
                            Cloud Community Club.
                        </span>
                    </h1>
                    <h1 className='title-main w-full text-center text-3xl md:text-5xl font-semibold mt-4 drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]'>
                        Building the future of cloud computing.
                    </h1>
                </div>

                {/* Core Team Application Button - Prominent placement */}
                <div className='w-[75%] mb-8'>
                    <h2 className='title-main text-center text-2xl font-semibold mb-4 text-blue-400 drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]'>
                        🌟 Core Team Applications Open! 🌟
                    </h2>
                    <a href='https://forms.gle/YOUR_FORM_ID' target='_blank' rel="noopener noreferrer" 
                        className='block hover:scale-[101%] hover:animate-pulse transition-all opacity-90 hover:opacity-100 duration-300 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-center'>
                        <div className='flex items-center justify-center gap-2'>
                            <span className='text-2xl font-bold text-white'>Apply for Core Team</span>
                            <SiGoogleforms className="w-7 h-7 text-white" />
                        </div>
                        <p className='font-medium mt-3 text-lg text-white'>Join our leadership team and help shape the future of cloud computing!</p>
                    </a>
                </div>

                {/* Community Section */}
                <div className='w-[75%]'>
                    <h2 className='title-main text-center text-2xl font-semibold mb-4 text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]'>
                        Join Our Community
                    </h2>
                    
                    {/* Discord Widget */}
                    <iframe 
                        src="https://discord.com/widget?id=YOUR_DISCORD_SERVER_ID&theme=dark"
                        width="100%"
                        height="400"
                        className='rounded-2xl drop-shadow-[0_0_20px_rgba(0,0,0,0.5)] mb-4'
                        allowTransparency={true}
                        frameBorder="0"
                        sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                    ></iframe>

                    {/* Community Buttons */}
                    <div className='flex flex-col sm:flex-row gap-4'>
                        {/* Discord Button */}
                        <a href='https://discord.gg/YOUR_INVITE_CODE' target='_blank' rel="noopener noreferrer" 
                            className='flex-1 hover:scale-[101%] hover:animate-pulse transition-all opacity-90 hover:opacity-100 duration-300 bg-[#5865F2] rounded-xl p-4 text-center'>
                            <div className='flex items-center justify-center gap-2'>
                                <span className='text-xl font-bold text-white'>Join Discord</span>
                                <svg className='w-6 h-6 text-white' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                                </svg>
                            </div>
                            <p className='font-medium mt-2 text-white'>Connect with cloud enthusiasts!</p>
                        </a>

                        {/* WhatsApp Button */}
                        <a href='https://chat.whatsapp.com/YOUR_GROUP_INVITE' target='_blank' rel="noopener noreferrer" 
                            className='flex-1 hover:scale-[101%] hover:animate-pulse transition-all opacity-90 hover:opacity-100 duration-300 bg-[#25D366] rounded-xl p-4 text-center'>
                            <div className='flex items-center justify-center gap-2'>
                                <span className='text-xl font-bold text-white'>Join WhatsApp</span>
                                <FaWhatsapp className="w-6 h-6 text-white" />
                            </div>
                            <p className='font-medium mt-2 text-white'>Stay updated with club activities!</p>
                        </a>
                    </div>
                </div>

                <Element name='recruitment' />
            </div>
        </div>
    )
}
