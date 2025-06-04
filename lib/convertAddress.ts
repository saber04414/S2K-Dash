export const AddressName: { [key: string]: string } = {
    '5HNfPMwyTkqo4jLuYkZN4kXCQd5tDoKQZdqQ82Jm9gg7Tspi': 'Co-S-K',
    '5HQQ7WLJb6frv78W1t92tge8y8yib2uf9PvRHrffumrhFdQz': 'Union2',
    '5HgxZ1z1RYkc3yx68BwJVbZKfEqYusLf3RbDfxjm82nSmaxP': 'SN85',
    '5GYsGZe8Ckmjo4RcHCGVyQSdvnDMPLBH29JPMzMv1eJQSE3u': 'Union4',
    '5Cnp6xwPA1VxsNi6tq7p36GMS1M41upd1nnaTFFynBhYPz5U': 'Union5',
    '5HaeRoi4U5NkfrmgnYjAMfzTn3qsTgA6UgSFKjrKqXLtbADz': 'Union6',
    '5D1to42rPyXMTTvtmaeriCUt1Jw6XtBqShbc57tdRWvhY7n8': 'Union7',
    '5FCWi3ZoP5Z8tgj2MkwCe4K2E3Z9hAuqHKbVEnpoAFfHRhDC': 'Moon~',
    '5G1KHsJZG12FktWDocKpUYC7Af2jgXeNJSc8avfjUY1HgQgd': 'Union8',
    '5CRrgW7W5ZDWRukPLi1DdCBtbUrLta6qthJE8r6hA9GhPqw4': 'Moon1',
    '5Fh2X1HqStsN2TZJPLBCy8ZybZh3SHCXGcYTDHnh7kAnFF7T': 'S2K Labs',
    '5FkHiULruUhoTSe58oRrFwoNRZ72iz9BFtLvLVVjeCTK8N9r': 'K2'
  };
  
type AddressKey = keyof typeof AddressName;

export const convertAddressToName = (coldkey: string): string => {
  return AddressName[coldkey as AddressKey] || coldkey;
};