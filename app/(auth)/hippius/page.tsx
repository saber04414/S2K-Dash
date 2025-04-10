import React from 'react'
import HippiusTR from '@/components/HippiusTR'

const HippiusPage = () => {
    const hippiuss = [
        {
            hotkey: "5F3tvAfcuVFQLC8x81fbXyN2bd32RtF9FUuUj5TNQn7rfCXb",
            coldkey: "5FvV6vtap12HyEy6P3WSVoCFPti6Fc3y3k3vj5Ng5TXgPhVD",
            node_id: "12D3KooWQhKvsVDW2SzQNvZ33rZFcWdN5gzBEJN7RNDKaceTSgNF",
            uid: "5"
        },
        {
            hotkey: "5CDZQgf9d483wu85iUD1aBbphevhD8K2muDi2RhsXU3RxVJu",
            coldkey: "5FvV6vtap12HyEy6P3WSVoCFPti6Fc3y3k3vj5Ng5TXgPhVD",
            node_id: "12D3KooWMzpJ1Yqx35MuoP1QutaDbjWPyfYhstCpv3wMB35Ev1wg",
            uid: "85"
        },
        {
            hotkey: "5CLr42xaj5eo7Mdm8tyoYHkdBWjZaA1Lsw4wbefH1CpUU9YS",
            coldkey: "5FvV6vtap12HyEy6P3WSVoCFPti6Fc3y3k3vj5Ng5TXgPhVD",
            node_id: "12D3KooWAy1Q9vqMkNodgGJoVLbQsYuC22TLJ7hPN3KqPatqwaNg",
            uid: "86"
        },
        {
            hotkey: "5E5DqjJYWT1M86FwzQ4PFFWeCLh1XdjBYHYVYvWkq2ZcpRke",
            coldkey: "5FvV6vtap12HyEy6P3WSVoCFPti6Fc3y3k3vj5Ng5TXgPhVD",
            node_id: "12D3KooWJirB1rFCRiARz26Njzr5Gr8W4C6yQoQwZW5TV1UN66rG",
            uid: "94"
        },
        {
            hotkey: "5GViKvASRKgNGWCwGSoWygTQ26KVUEPdxxDze1soUSe5RDJd",
            coldkey: "5FvV6vtap12HyEy6P3WSVoCFPti6Fc3y3k3vj5Ng5TXgPhVD",
            node_id: "12D3KooWFgXjadnNG6AP3RmJ9BC3XdvoDeAYyLUoiYWuHmULAh2K",
            uid: "97"
        },
        {
            hotkey: "5FEjosPPCgAeRTx2t94Pe4Ar2Aqed8oWxw5N6sszaJ1q6M6w",
            coldkey: "5FvV6vtap12HyEy6P3WSVoCFPti6Fc3y3k3vj5Ng5TXgPhVD",
            node_id: "12D3KooWFNuEdNGVNHsEBntvwZhpkSTwFcHRNMfpfrJ5e42pacsC",
            uid: "101"
        },
        {
            hotkey: "5GxDEayQCSPcDL8A3SjwByiVdtT2E52swhuiTZm5wH5Uxp89",
            coldkey: "5FvV6vtap12HyEy6P3WSVoCFPti6Fc3y3k3vj5Ng5TXgPhVD",
            node_id: "12D3KooWRB5nQQjxJA3kxGzEQYnsJe7UWBXjZdrEbTQoA2dmdQZJ",
            uid: "132"
        },
        {
            hotkey: "5FBidnDbP8SWt89Udjz16sBk8KD4hKoVQ1aGthr9efdrjhya",
            coldkey: "5FvV6vtap12HyEy6P3WSVoCFPti6Fc3y3k3vj5Ng5TXgPhVD",
            node_id: "12D3KooWPz2w5htVTScNV5k1WEftVH33dJM8qoT3uLJRPsKqXDy3",
            uid: "137"
        },
        {
            hotkey: "5FUZYGEsgtbjVHg2kMvTMN855hYCKgrdTZJsNzbQNEq8josA",
            coldkey: "5FvV6vtap12HyEy6P3WSVoCFPti6Fc3y3k3vj5Ng5TXgPhVD",
            node_id: "12D3KooWPbFodBnN4VGdHDjezQ64E7Vy9YwXVPcYktL2MTqPLiuF",
            uid: "146"
        },
        {
            hotkey: "5CQ7zcFxh7yMEpgWbWneqyWaMLca7uDtHvsy8dSqMJfDF2aA",
            coldkey: "5FvV6vtap12HyEy6P3WSVoCFPti6Fc3y3k3vj5Ng5TXgPhVD",
            node_id: "12D3KooWM2J8wCB93DhTvgfUNtRpaBiVmAaXRst4r1qn2mavaUnK",
            uid: "147"
        }
    ]
    return (
        <div className='w-screen px-10'>
            <div className='flex flex-col gap-2 w-full'>
                <table>
                    <thead>
                        <tr>
                            <th>UID</th>
                            <th>Coldkey</th>
                            <th>Hotkey</th>
                            <th>Node ID</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            hippiuss.map((hippius, index) => (
                                <HippiusTR coldkey={hippius.coldkey} hotkey={hippius.hotkey} node_id={hippius.node_id} uid={hippius.uid} key={index} />
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}


export default HippiusPage