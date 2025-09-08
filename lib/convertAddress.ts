export const AddressName: { [key: string]: string } = {
    '5HNfPMwyTkqo4jLuYkZN4kXCQd5tDoKQZdqQ82Jm9gg7Tspi': 'Union1',
    '5HQQ7WLJb6frv78W1t92tge8y8yib2uf9PvRHrffumrhFdQz': 'Union2',
    '5HgxZ1z1RYkc3yx68BwJVbZKfEqYusLf3RbDfxjm82nSmaxP': 'SN85',
    '5GYsGZe8Ckmjo4RcHCGVyQSdvnDMPLBH29JPMzMv1eJQSE3u': 'Union4',
    '5Cnp6xwPA1VxsNi6tq7p36GMS1M41upd1nnaTFFynBhYPz5U': 'Union5',
    '5HaeRoi4U5NkfrmgnYjAMfzTn3qsTgA6UgSFKjrKqXLtbADz': 'Union6',
    '5D1to42rPyXMTTvtmaeriCUt1Jw6XtBqShbc57tdRWvhY7n8': 'Union7',
    '5FCWi3ZoP5Z8tgj2MkwCe4K2E3Z9hAuqHKbVEnpoAFfHRhDC': 'Moon~',
    '5G1KHsJZG12FktWDocKpUYC7Af2jgXeNJSc8avfjUY1HgQgd': 'Union8',
    '5CRrgW7W5ZDWRukPLi1DdCBtbUrLta6qthJE8r6hA9GhPqw4': 'Moon1',
    '5HZAKfn97xkdpFQ6kUmVGz6aVSFLaxn6bJ887zxpEv2VdF9g': 'SKX1',
    '5DMJv8NQJKRGH1nLK8W8bxy41agZBPvF5ek9zBTZXTrXbDRp': 'SKX2',
    '5CqUe8FKvN7Yvfd1N1w8F7Qg58mkeEudf3iCJ9heY737iUDM': 'SKX3',
    '5Fh2X1HqStsN2TZJPLBCy8ZybZh3SHCXGcYTDHnh7kAnFF7T': 'S2K Labs',
    '5HbDZ6ULuwZegAMSPaS2kaUfBLMDaht5t48RcDrQATSgGCAR': 'S2K Labs',
    '5FkHiULruUhoTSe58oRrFwoNRZ72iz9BFtLvLVVjeCTK8N9r': 'K2',
    '5FbZXuyucSr6BzCY9sRSiRyL5HBo54nAxp4dFNxCd4Q8C5yy': 'Ghost1',
    '5G8rwaxuL54qci8xQRtFnduwuzpsy7ebYUfps3b6qBVgbm6B': 'OOO',
    '5CXuhs6iCGQn25fPPTbaaL83pfPbbjCrff5rXkBtXtHVNnaD': 'Ghost2',
    '5HDyRMcx24THnpWgCo9v6pauDN5xH5DEYqKAvrAbPM93Lska': 'Ghost3',
    '5GeQumgMBbj8Nf4fgDBmeZTRUpyuc99uN1SD3e5srbvZ8XaN': 'aioV2',
  };
  
type AddressKey = keyof typeof AddressName;

export const convertAddressToName = (coldkey: string): string => {
  return AddressName[coldkey as AddressKey] || coldkey;
};