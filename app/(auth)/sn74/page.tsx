'use client'
import React, { useState } from 'react'
import useSWR from 'swr'
import { fetcher } from '@/utils/fetcher'
import ImageLoadingSpinner from '@/components/ImageLoadingSpinner'
import { ArrowLeft, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'

type GitTensorItem = {
    fullName: string
    weight: string
    inactiveAt: string
    lastMergedAgo: string | null
    languages: string[]
    openIssues: number
    openPRs: number
}

const ALLOWED_LANGUAGES = ['Python', 'JavaScript', 'TypeScript', 'Go', 'Rust', 'PHP', 'Java', 'C', 'C++'];

const Sn74Page = () => {
    const router = useRouter()
    const [sortKey, setSortKey] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(50);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
    const { data, error, isLoading } = useSWR('/gittensor.json', fetcher, {
        revalidateOnFocus: false,
    })

    const handleSort = (key: string) => {
        if (sortKey === key) {
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortKey(key);
            setSortOrder("asc");
        }
        setCurrentPage(1); // Reset to first page when sorting changes
    };

    const renderSortIcon = (key: string) => {
        if (sortKey !== key) return null;
        return sortOrder === "asc" ? <ArrowUp size={14} className="inline ml-1" /> : <ArrowDown size={14} className="inline ml-1" />;
    };

    const parseLastMerged = (lastMergedAgo: string | null): number => {
        if (!lastMergedAgo) return Infinity; // null values go to the end
        
        const match = lastMergedAgo.match(/(\d+)\s*(day|days|month|months|year|years|hour|hours|minute|minutes|second|seconds)\s*ago/i);
        if (!match) return Infinity;
        
        const value = parseInt(match[1], 10);
        const unit = match[2].toLowerCase();
        
        // Convert everything to days for comparison
        if (unit.includes('second')) return value / 86400;
        if (unit.includes('minute')) return value / 1440;
        if (unit.includes('hour')) return value / 24;
        if (unit.includes('day')) return value;
        if (unit.includes('month')) return value * 30;
        if (unit.includes('year')) return value * 365;
        
        return Infinity;
    };

    const formatDate = (dateString: string | null): string => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateString;
        }
    };

    const filterData = (data: GitTensorItem[]) => {
        if (!data) return [];
        
        return data.filter((item: GitTensorItem) => {
            // Search filter
            const matchesSearch = searchQuery === '' || 
                item.fullName.toLowerCase().includes(searchQuery.toLowerCase());
            
            // Language filter
            const matchesLanguage = selectedLanguage === 'all' || 
                (item.languages && item.languages.includes(selectedLanguage));
            
            return matchesSearch && matchesLanguage;
        });
    };

    const sortData = (data: GitTensorItem[]) => {
        if (!sortKey || !data) return data;
        
        return [...data].sort((a: GitTensorItem, b: GitTensorItem) => {
            const dir = sortOrder === "asc" ? 1 : -1;
            switch (sortKey) {
                case "github": {
                    return dir * a.fullName.localeCompare(b.fullName);
                }
                case "weight": {
                    const weightA = parseFloat(a.weight) || 0;
                    const weightB = parseFloat(b.weight) || 0;
                    return dir * (weightA - weightB);
                }
                case "lastMerged": {
                    const daysA = parseLastMerged(a.lastMergedAgo);
                    const daysB = parseLastMerged(b.lastMergedAgo);
                    return dir * (daysA - daysB);
                }
                case "inactiveAt": {
                    const dateA = a.inactiveAt ? new Date(a.inactiveAt).getTime() : 0;
                    const dateB = b.inactiveAt ? new Date(b.inactiveAt).getTime() : 0;
                    return dir * (dateA - dateB);
                }
                case "languages": {
                    const filteredA = (a.languages || []).filter(lang => ALLOWED_LANGUAGES.includes(lang));
                    const filteredB = (b.languages || []).filter(lang => ALLOWED_LANGUAGES.includes(lang));
                    const langA = filteredA.join(', ') || '';
                    const langB = filteredB.join(', ') || '';
                    return dir * langA.localeCompare(langB);
                }
                case "openIssues": {
                    return dir * ((a.openIssues || 0) - (b.openIssues || 0));
                }
                case "openPRs": {
                    return dir * ((a.openPRs || 0) - (b.openPRs || 0));
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

    if (data) {
        const filteredData = filterData(data as GitTensorItem[]);
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
                <div className='text-2xl font-bold text-center'>Subnet 74 - GitTensor</div>
                {/* Search and Filter Controls */}
                <div className='flex flex-row gap-4 items-center justify-center'>
                    <div className='relative flex items-center'>
                        <Search size={18} className='absolute left-3 text-slate-400' />
                        <input
                            type='text'
                            placeholder='Search by repository name...'
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className='pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:border-slate-500 w-80'
                        />
                    </div>
                    <div className='flex flex-row items-center gap-2'>
                        <label className='text-sm text-slate-400'>Filter by language:</label>
                        <select
                            value={selectedLanguage}
                            onChange={(e) => {
                                setSelectedLanguage(e.target.value);
                                setCurrentPage(1);
                            }}
                            className='px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-white focus:outline-none focus:border-slate-500'
                        >
                            <option value='all'>All Languages</option>
                            {ALLOWED_LANGUAGES.map((lang) => (
                                <option key={lang} value={lang}>{lang}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className='flex flex-col gap-2'>
                    <table className='w-full'>
                        <thead>
                            <tr className='bg-slate-700'>
                                <th className='text-center py-3'>No</th>
                                <th className='text-center py-3 cursor-pointer hover:bg-slate-600 transition-colors' onClick={() => handleSort('github')}>
                                    Github {renderSortIcon('github')}
                                </th>
                                <th className='text-center py-3 cursor-pointer hover:bg-slate-600 transition-colors' onClick={() => handleSort('weight')}>
                                    Weight {renderSortIcon('weight')}
                                </th>
                                <th className='text-center py-3 cursor-pointer hover:bg-slate-600 transition-colors' onClick={() => handleSort('lastMerged')}>
                                    Last Merged {renderSortIcon('lastMerged')}
                                </th>
                                <th className='text-center py-3 cursor-pointer hover:bg-slate-600 transition-colors' onClick={() => handleSort('inactiveAt')}>
                                    Inactive At {renderSortIcon('inactiveAt')}
                                </th>
                                <th className='text-center py-3 cursor-pointer hover:bg-slate-600 transition-colors' onClick={() => handleSort('languages')}>
                                    Languages {renderSortIcon('languages')}
                                </th>
                                <th className='text-center py-3 cursor-pointer hover:bg-slate-600 transition-colors' onClick={() => handleSort('openIssues')}>
                                    Open Issues {renderSortIcon('openIssues')}
                                </th>
                                <th className='text-center py-3 cursor-pointer hover:bg-slate-600 transition-colors' onClick={() => handleSort('openPRs')}>
                                    Open PRs {renderSortIcon('openPRs')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map((item: GitTensorItem, index: number) => (
                                <tr key={startIndex + index} className={clsx('transition-all', index % 2 === 0 ? '' : 'bg-slate-800')}>
                                    <td className='text-center py-3'>{startIndex + index + 1}</td>
                                    <td className='text-center py-3'>
                                        <a 
                                            href={`https://github.com/${item.fullName}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className='text-blue-400 hover:text-blue-300 hover:underline'
                                        >
                                            {item.fullName}
                                        </a>
                                    </td>
                                    <td className='text-center py-3'>{item.weight}</td>
                                    <td className='text-center py-3'>{item.lastMergedAgo || 'N/A'}</td>
                                    <td className='text-center py-3'>{formatDate(item.inactiveAt)}</td>
                                    <td className='text-center py-3'>
                                        {(() => {
                                            const filteredLanguages = item.languages?.filter(lang => 
                                                ALLOWED_LANGUAGES.includes(lang)
                                            ) || [];
                                            return filteredLanguages.length > 0 ? (
                                                <div className='flex flex-wrap gap-1 justify-center'>
                                                    {filteredLanguages.map((lang, langIndex) => (
                                                        <span 
                                                            key={langIndex}
                                                            className='px-2 py-1 bg-slate-600 rounded text-xs'
                                                        >
                                                            {lang}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className='text-slate-500'>-</span>
                                            );
                                        })()}
                                    </td>
                                    <td className='text-center py-3'>{item.openIssues ?? 0}</td>
                                    <td className='text-center py-3'>{item.openPRs ?? 0}</td>
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

export default Sn74Page

