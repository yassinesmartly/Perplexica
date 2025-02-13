'use client';

import DeleteChat from '@/components/DeleteChat';
import { cn, groupChatsByDate, orderedGroups } from '@/lib/utils';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { Ellipsis } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import RenameChat from './RenameChat';
import ShareChat from './ShareChat';
import ArchiveChat from './ArchiveChat';
import useHistoryStore from '@/stores/history-store';
import Tooltip from './Tooltip';
import { useRouter } from 'next/navigation';

export interface Chat {
    id: string;
    title: string;
    createdAt: string;
    focusMode: string;
    token: string;
}

const History = () => {
    const [chats, setChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchChats = async () => {
        setLoading(true);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chats/${localStorage.getItem('token')}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await res.json();

        setChats(data.chats);
        setLoading(false);
    };

    const { updateHistory } = useHistoryStore();

    useEffect(() => {
        fetchChats();
    }, [updateHistory]);

    const sortedGroupEntries = Object.entries(groupChatsByDate(chats)).sort(
        ([a], [b]) => {
            const aIndex = orderedGroups.indexOf(a);
            const bIndex = orderedGroups.indexOf(b);
            return (aIndex !== -1 ? aIndex : Infinity) - (bIndex !== -1 ? bIndex : Infinity);
        }
      );

    const t = useTranslations('History');     

    return loading ? (
        <div className="flex flex-row items-center justify-center min-h-screen">
            <svg
                aria-hidden="true"
                className="w-8 h-8 text-light-200 fill-light-secondary dark:text-[#202020] animate-spin dark:fill-[#ffffff3b]"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M100 50.5908C100.003 78.2051 78.1951 100.003 50.5908 100C22.9765 99.9972 0.997224 78.018 1 50.4037C1.00281 22.7993 22.8108 0.997224 50.4251 1C78.0395 1.00281 100.018 22.8108 100 50.4251ZM9.08164 50.594C9.06312 73.3997 27.7909 92.1272 50.5966 92.1457C73.4023 92.1642 92.1298 73.4365 92.1483 50.6308C92.1669 27.8251 73.4392 9.0973 50.6335 9.07878C27.8278 9.06026 9.10003 27.787 9.08164 50.594Z"
                    fill="currentColor"
                />
                <path
                    d="M93.9676 39.0409C96.393 38.4037 97.8624 35.9116 96.9801 33.5533C95.1945 28.8227 92.871 24.3692 90.0681 20.348C85.6237 14.1775 79.4473 9.36872 72.0454 6.45794C64.6435 3.54717 56.3134 2.65431 48.3133 3.89319C45.869 4.27179 44.3768 6.77534 45.014 9.20079C45.6512 11.6262 48.1343 13.0956 50.5786 12.717C56.5073 11.8281 62.5542 12.5399 68.0406 14.7911C73.527 17.0422 78.2187 20.7487 81.5841 25.4923C83.7976 28.5886 85.4467 32.059 86.4416 35.7474C87.1273 38.1189 89.5423 39.6781 91.9676 39.0409Z"
                    fill="currentFill"
                />
            </svg>
        </div>
    ) : (
        <div>
            {chats?.length === 0 && (
                <div className="flex flex-row items-center justify-center min-h-screen">
                    <p className="text-black/70 dark:text-white/70 text-sm">
                        {t("message")}
                    </p>
                </div>
            )}
            {chats?.length > 0 && (
                <div className="flex flex-col py-5">
                  {sortedGroupEntries.map(
                  ([group, groupChats]) => (
                  <div key={group} className="mb-6">
                    <h3 className="text-sm font-bold text-black dark:text-white mb-2 px-2">
                      {t(`dateGroups.${group}`)}
                    </h3>
                    {groupChats.map((chat, i) => (
                        <div
                            key={i}
                            className={cn(
                                'flex items-center justify-between w-full hover:bg-light-200 dark:hover:bg-dark-200 p-2 rounded-lg transition duration-200 group',
                                i !== groupChats.length - 1
                                    ? 'mb-2'
                                    : '',
                            )}
                            onClick={() => router.push(`/c/${chat.id}`)}
                        >
                            <div
                                className="flex-1 text-black dark:text-white lg:text-[14px]  font-[400] truncate transition duration-200 hover:text-[#24A0ED] dark:hover:text-[#24A0ED] cursor-pointer"
                            >
                                {chat.title}
                            </div>

                            <Popover className="relative flex items-center invisible group-hover:visible">
                                <PopoverButton className="flex items-center">
                                    <Tooltip content={t("options")}>
                                        <Ellipsis className="cursor-pointer" />
                                    </Tooltip>
                                </PopoverButton>
                                <PopoverPanel
                                    anchor="bottom start"
                                    className="flex flex-col z-[50] border-2 bg-white dark:bg-dark-secondary rounded-lg shadow-lg"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <RenameChat chatId={chat.id} chatTitle={chat.title} fetchChats={fetchChats} />
                                    <ShareChat chatId={chat.id} />
                                    <ArchiveChat chatId={chat.id} />
                                    <DeleteChat chatId={chat.id} chats={chats} setChats={setChats} />
                                </PopoverPanel>
                            </Popover>
                        </div>
                    ))}
                </div >
            ))}
            </div>
            )}
        </div>
    );
};

export default History