'use client'
import React, { useState } from 'react'
import useSWR from 'swr'
import { fetcher } from '@/utils/fetcher'
import ImageLoadingSpinner from '@/components/ImageLoadingSpinner'
import { ArrowLeft, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'
import { copyKey, showKey } from '@/lib/main'

type VPSItem = {
    ip_address: string
    connected: boolean
    coldkey: string | null
    hotkey: string | null
    os_version: string | null
}

type VPSResponse = {
    vps_list: VPSItem[]
}

const Sn31Page = () => {
    const router = useRouter()
    const [sortKey, setSortKey] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(50);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [connectionFilter, setConnectionFilter] = useState<string>('all');
    const { data, error, isLoading } = useSWR<VPSResponse>('http://2.56.179.136:31000/api/candles', fetcher, {
        refreshInterval: 10_000, // Refresh every 10 seconds
        revalidateOnFocus: false,
    })

    const handleSort = (key: string) => {
        if (sortKey === key) {
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortKey(key);
            setSortOrder("asc");
        }
        setCurrentPage(1);
    };

    const renderSortIcon = (key: string) => {
        if (sortKey !== key) return null;
        return sortOrder === "asc" ? <ArrowUp size={14} className="inline ml-1" /> : <ArrowDown size={14} className="inline ml-1" />;
    };

    const filterData = (data: VPSItem[]) => {
        if (!data) return [];
        
        return data.filter((item: VPSItem) => {
            // Search filter (by IP address, coldkey, hotkey)
            const matchesSearch = searchQuery === '' || 
                item.ip_address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.coldkey && item.coldkey.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (item.hotkey && item.hotkey.toLowerCase().includes(searchQuery.toLowerCase()));
            
            // Connection filter
            const matchesConnection = connectionFilter === 'all' || 
                (connectionFilter === 'connected' && item.connected) ||
                (connectionFilter === 'disconnected' && !item.connected);
            
            return matchesSearch && matchesConnection;
        });
    };

    const sortData = (data: VPSItem[]) => {
        if (!sortKey || !data) return data;
        
        return [...data].sort((a: VPSItem, b: VPSItem) => {
            const dir = sortOrder === "asc" ? 1 : -1;
            switch (sortKey) {
                case "ip_address": {
                    return dir * a.ip_address.localeCompare(b.ip_address);
                }
                case "connected": {
                    return dir * (a.connected === b.connected ? 0 : a.connected ? 1 : -1);
                }
                case "coldkey": {
                    const coldkeyA = a.coldkey || '';
                    const coldkeyB = b.coldkey || '';
                    return dir * coldkeyA.localeCompare(coldkeyB);
                }
                case "hotkey": {
                    const hotkeyA = a.hotkey || '';
                    const hotkeyB = b.hotkey || '';
                    return dir * hotkeyA.localeCompare(hotkeyB);
                }
                case "os_version": {
                    const osA = a.os_version || '';
                    const osB = b.os_version || '';
                    return dir * osA.localeCompare(osB);
                }
                default:
                    return 0;
            }
        });
    };

    if (isLoading) return (
        <div className='w-full h-full'>
            <ImageLoadingSpinner />
        </div>
    )

    if (error) return (
        <div className='w-full h-full flex flex-col gap-3 items-center justify-center'>
            <img src="/mark.png" className='w-32 h-24' alt='' />
            Data Fetching Error
        </div>
    )

    if (data && data.vps_list) {
        const filteredData = filterData(data.vps_list);
        const sortedData = sortData(filteredData);
        const totalItems = sortedData.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedData = sortedData.slice(startIndex, endIndex);
        
        // Calculate page numbers to display
        const getPageNumbers = () => {
            const pages: (number | string)[] = [];
            const maxVisible = 7;
            
            if (totalPages <= maxVisible) {
                for (let i = 1; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                if (currentPage <= 3) {
                    for (let i = 1; i <= 5; i++) pages.push(i);
                    pages.push('...');
                    pages.push(totalPages);
                } else if (currentPage >= totalPages - 2) {
                    pages.push(1);
                    pages.push('...');
                    for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
                } else {
                    pages.push(1);
                    pages.push('...');
                    for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                    pages.push('...');
                    pages.push(totalPages);
                }
            }
            return pages;
        };
        
        return (
            <div className='w-full flex flex-col gap-10 justify-center relative'>
                <div 
                    className='absolute top-0 left-0 w-fit text-center p-2 cursor-pointer flex flex-row gap-2 items-center' 
                    onClick={() => router.back()}
                >
                    <ArrowLeft size={18} />
                    Back
                </div>
                <div className='text-2xl font-bold text-center'>Subnet 31 - VPS Status</div>
                {/* Search and Filter Controls */}
                <div className='flex flex-row gap-4 items-center justify-center'>
                    <div className='relative flex items-center'>
                        <Search size={18} className='absolute left-3 text-slate-400' />
                        <input
                            type='text'
                            placeholder='Search by IP, Coldkey, or Hotkey...'
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className='pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:border-slate-500 w-80'
                        />
                    </div>
                    <div className='flex flex-row items-center gap-2'>
                        <label className='text-sm text-slate-400'>Connection Status:</label>
                        <select
                            value={connectionFilter}
                            onChange={(e) => {
                                setConnectionFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            className='px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-white focus:outline-none focus:border-slate-500'
                        >
                            <option value='all'>All</option>
                            <option value='connected'>Connected</option>
                            <option value='disconnected'>Disconnected</option>
                        </select>
                    </div>
                </div>
                <div className='flex flex-col gap-2'>
                    <table className='w-full'>
                        <thead>
                            <tr className='bg-slate-700'>
                                <th className='text-center py-3'>No</th>
                                <th className='text-center py-3 cursor-pointer hover:bg-slate-600 transition-colors' onClick={() => handleSort('ip_address')}>
                                    IP Address {renderSortIcon('ip_address')}
                                </th>
                                <th className='text-center py-3 cursor-pointer hover:bg-slate-600 transition-colors' onClick={() => handleSort('connected')}>
                                    Status {renderSortIcon('connected')}
                                </th>
                                <th className='text-center py-3 cursor-pointer hover:bg-slate-600 transition-colors' onClick={() => handleSort('coldkey')}>
                                    Coldkey {renderSortIcon('coldkey')}
                                </th>
                                <th className='text-center py-3 cursor-pointer hover:bg-slate-600 transition-colors' onClick={() => handleSort('hotkey')}>
                                    Hotkey {renderSortIcon('hotkey')}
                                </th>
                                <th className='text-center py-3 cursor-pointer hover:bg-slate-600 transition-colors' onClick={() => handleSort('os_version')}>
                                    OS Version {renderSortIcon('os_version')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map((item: VPSItem, index: number) => (
                                <tr key={item.ip_address} className={clsx('transition-all', index % 2 === 0 ? '' : 'bg-slate-800')}>
                                    <td className='text-center py-3'>{startIndex + index + 1}</td>
                                    <td className='text-center py-3'>{item.ip_address}</td>
                                    <td className='text-center py-3'>
                                        <div className='flex items-center justify-center'>
                                            <div className={clsx(
                                                'w-4 h-4 rounded-full',
                                                item.connected ? 'bg-blue-500 shadow-lg shadow-blue-500/50' : 'bg-red-500 shadow-lg shadow-red-500/50'
                                            )} />
                                            <span className={clsx(
                                                'ml-2 text-sm',
                                                item.connected ? 'text-blue-400' : 'text-red-400'
                                            )}>
                                                {item.connected ? 'Connected' : 'Disconnected'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className='text-center py-3'>
                                        {item.coldkey ? (
                                            <span 
                                                className='cursor-pointer hover:text-blue-400 transition-colors'
                                                onClick={() => copyKey(item.coldkey!)}
                                            >
                                                {showKey(item.coldkey)}
                                            </span>
                                        ) : (
                                            <span className='text-slate-500'>-</span>
                                        )}
                                    </td>
                                    <td className='text-center py-3'>
                                        {item.hotkey ? (
                                            <span 
                                                className='cursor-pointer hover:text-blue-400 transition-colors'
                                                onClick={() => copyKey(item.hotkey!)}
                                            >
                                                {showKey(item.hotkey)}
                                            </span>
                                        ) : (
                                            <span className='text-slate-500'>-</span>
                                        )}
                                    </td>
                                    <td className='text-center py-3'>{item.os_version || <span className='text-slate-500'>-</span>}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Pagination Controls */}
                    <div className='flex flex-row items-center justify-between mt-4'>
                        <div className='flex flex-row items-center gap-2'>
                            <span className='text-sm text-slate-400'>Items per page:</span>
                            <select
                                value={itemsPerPage}
                                onChange={(e) => {
                                    setItemsPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className='px-2 py-1 bg-slate-700 border border-slate-600 rounded text-sm'
                            >
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                                <option value={200}>200</option>
                            </select>
                        </div>
                        <div className='flex flex-row items-center gap-2'>
                            <span className='text-sm text-slate-400'>
                                Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} entries
                            </span>
                        </div>
                        <div className='flex flex-row items-center gap-2'>
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className={clsx(
                                    'px-3 py-1 rounded border transition-colors flex items-center gap-1',
                                    currentPage === 1
                                        ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
                                        : 'bg-slate-700 border-slate-600 hover:bg-slate-600 cursor-pointer'
                                )}
                            >
                                <ChevronLeft size={16} />
                                Previous
                            </button>
                            <div className='flex flex-row items-center gap-1'>
                                {getPageNumbers().map((page, idx) => (
                                    page === '...' ? (
                                        <span key={`ellipsis-${idx}`} className='px-2 text-slate-400'>...</span>
                                    ) : (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page as number)}
                                            className={clsx(
                                                'px-3 py-1 rounded border transition-colors text-sm',
                                                currentPage === page
                                                    ? 'bg-slate-600 border-slate-500 text-white'
                                                    : 'bg-slate-700 border-slate-600 hover:bg-slate-600 text-slate-300'
                                            )}
                                        >
                                            {page}
                                        </button>
                                    )
                                ))}
                            </div>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className={clsx(
                                    'px-3 py-1 rounded border transition-colors flex items-center gap-1',
                                    currentPage === totalPages
                                        ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
                                        : 'bg-slate-700 border-slate-600 hover:bg-slate-600 cursor-pointer'
                                )}
                            >
                                Next
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return null
}

export default Sn31Page

