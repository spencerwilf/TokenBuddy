'use client'
import React, {useState, useEffect} from 'react'
import { http, parseAbiItem, parseEther, webSocket, getContract } from 'viem'
import { readContract, waitForTransaction, writeContract } from "wagmi/actions";
import {abi} from '../../../artifacts/contracts/ERC20Factory.sol/ERC20Factory.json'
import { sepolia, useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from 'wagmi/connectors/injected'
import { createPublicClient } from 'viem'
import { Stepper } from '@web3uikit/core';
import {Inter} from 'next/font/google'
import ConnectButton from './ConnectButton';
import token from '../../public/token.png'

const TokenForm = () => {
    const [step, setStep] = useState(1)
    const [name, setName] = useState('')
    const [symbol, setSymbol] = useState('')
    const [supply, setSupply] = useState('')
    const [loading, setLoading] = useState(false)
    const [txSuccess, setTxSuccess] = useState(false)
    const [tokenAddress, setTokenAddress] = useState('')
    const [errors, setErrors] = useState({})

    const { address, isConnected } = useAccount();

    console.log(isConnected)

    const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
    const { disconnect } = useDisconnect()

    const handleStep = () => {
        setStep(step + 1);
    }

    const handleBack = () => {
        setStep(step - 1);
    }

    const handleNameEdit = () => {
        setStep(1)
    }

    const handleSymbolEdit = () => {
        setStep(2)
    }

    const handleSupplyEdit = () => {
        setStep(3)
    }

    useEffect(() => {
        const fetchData = async () => {
            const client = createPublicClient({ 
                chain: sepolia,
                transport: http()
            });

            const logs = await client.getLogs({  
                address: '0xc8575D5ee74443bEB0A5088723c1a3598Be1583a',
                event: parseAbiItem('event TokenCreated(address indexed tokenAddress,string name, string symbol, uint initialSupply)'),
            });

            setTokenAddress(logs[0]?.args?.tokenAddress);
        };

        fetchData();
    }, [txSuccess]);

    useEffect(() => {
        const errors = {}
        if (!name) errors.name = "Please enter a name"
        if (!symbol) errors.symbol = "Please enter a symbol"
        if (!supply) errors.supply = "Please enter a valid supply"
    }, [])


    const doItAgain = () => {
        setName('')
        setSymbol('')
        setSupply('')
        setStep(1)
        setTxSuccess(false)
    }


   
    const deploy = async() => {
    
        try {
            const tx = await writeContract({
            address: '0xc8575D5ee74443bEB0A5088723c1a3598Be1583a',
            abi,
            functionName: 'createToken',
            args: [name, symbol, parseEther(supply)]
            })
            
            setStep(step + 1)
            setLoading(true)
            await waitForTransaction(tx)
            setTxSuccess(true)

        } catch(e) {
            console.log(e)
        }
        setLoading(false)
    }

    const isNumber = (input) => {
        const regex = /^\d+$/;
        return regex.test(input);
    }



  return (

<div>
        {step == 1 && (
            
<div className='flex justify-center'>
    <div className="border border-white mockup-browser shadow-lg rounded-xl w-1/2 h-[75vh] overflow-hidden mt-10">
        <div className="mockup-browser-toolbar ">
            <div className="input">https://tokenbuddy.com/name</div>
        </div>
        <h2 className="font-retro border-t  text-white text-5xl flex justify-center px-4 py-6">GM. Enter a name for your token</h2>
        <div className="join flex justify-center py-6 px-4 rounded-b-xl">
            <div className='flex items-center flex-col gap-10'>
                <input onChange={e => setName(e.target.value)} value={name} className="input font-retro text-3xl input-bordered join-item mr-4 bg-white rounded shadow-inner" placeholder="Token name"/>
                <button className='bg-purple-500 font-retro text-2xl text-white font-bold rounded shadow-lg hover:bg-purple-600 w-40 h-10' disabled={!name} onClick={handleStep}>Next</button>
            </div>
        </div>
    </div>
</div>

        )}

        {step == 2 && (
<div className='flex justify-center'>
    <div className="border border-white mockup-browser shadow-lg rounded-xl w-1/2 h-[75vh] overflow-hidden mt-10">
        <div className="mockup-browser-toolbar ">
            <div className="input">https://tokenbuddy.com/symbol</div>
        </div>
        <h2 className=" border-t font-retro text-white text-5xl flex justify-center px-4 py-6">Nice! Now pick a symbol</h2>
        <div className="join flex justify-center py-6 px-4 rounded-b-xl">
            <div className='flex items-center flex-col gap-10'>
                <input onChange={e => setSymbol(e.target.value)} value={symbol} className="input font-retro text-3xl input-bordered join-item mr-4 bg-white rounded shadow-inner" placeholder="Token symbol"/>
                <div className='flex gap-6'>
                <button className='bg-purple-500 font-retro text-2xl  text-white font-bold rounded shadow-lg hover:bg-purple-600 w-40 h-10 ' onClick={handleBack} >Back</button>
                <button className='bg-purple-500 font-retro text-2xl text-white font-bold rounded shadow-lg hover:bg-purple-600 w-40 h-10' disabled={!symbol} onClick={handleStep}>Next</button>
                </div>
            </div>
        </div>
    </div>
</div>
        )}

        {step == 3 && (
<div className='flex justify-center'>
    <div className="border border-white mockup-browser shadow-lg rounded-xl w-1/2 h-[75vh] overflow-hidden mt-10">
        <div className="mockup-browser-toolbar ">
            <div className="input">https://tokenbuddy.com/supply</div>
        </div>
        <h2 className=" border-t font-retro text-white text-5xl flex justify-center px-4 py-6">Now set the supply</h2>
        <div className="join flex justify-center py-6 px-4 rounded-b-xl">
            <div className='flex items-center flex-col gap-10'>
                <input onChange={e => setSupply(e.target.value)} value={supply} className="input font-retro text-3xl input-bordered join-item mr-4 bg-white rounded shadow-inner" placeholder="Token supply"/>
                <div className='flex gap-6'>
                <button className='bg-purple-500 font-retro text-2xl  text-white font-bold rounded shadow-lg hover:bg-purple-600 w-40 h-10 ' onClick={handleBack} >Back</button>
                <button className='bg-purple-500 font-retro text-2xl text-white font-bold rounded shadow-lg hover:bg-purple-600 w-40 h-10' disabled={!symbol} onClick={handleStep}>Next</button>
                </div>
            </div>
        </div>
    </div>
</div>
        )}

        {step == 4 && (

<div className='flex justify-center'>
    <div className="border border-white mockup-browser shadow-lg rounded-xl w-1/2 h-[75vh] overflow-hidden mt-10">
        <div className="mockup-browser-toolbar ">
            <div className=" input">https://tokenbuddy.com/deploy</div>
        </div>
        <h2 className=" border-t font-retro text-white text-5xl flex justify-center px-4 py-6">Does everything look okay?</h2>
        <div className="join flex justify-center py-6 px-4 rounded-b-xl">
            <div className='flex  flex-col gap-8'>

                <div>
                    <div className='flex items-center justify-between'>
               <p className='font-retro text-white text-4xl'>Name</p>
               <p onClick={handleNameEdit} className='font-retro text-white text-xl cursor-pointer'>Edit</p>
               </div>
               <p className='font-retro text-white text-2xl'>{name}</p>
        
               </div>

                <div>
                    <div className='flex items-center justify-between'>
               <p className='font-retro text-white text-4xl'>Symbol</p>
               <p onClick={handleSymbolEdit} className='font-retro text-white text-xl cursor-pointer'>Edit</p>
               </div>
               <p className='font-retro text-white text-2xl'>{symbol}</p>
        
               </div>

                 <div>
                    <div className='flex items-center justify-between'>
               <p className='font-retro text-white text-4xl'>Supply</p>
               <p onClick={handleSupplyEdit} className='font-retro text-white text-xl cursor-pointer'>Edit</p>
               </div>
               <p className='font-retro text-white text-2xl'>{supply}</p>
        
               </div>

            
                
               {isConnected ? (<button className='bg-purple-500 text-white font-bold rounded shadow-lg hover:bg-purple-600 w-40 h-10 font-retro text-2xl' onClick={deploy}>Deploy</button>) : (<p className='font-retro text-white text-2xl'>Please connect your wallet to deploy</p>)}
            </div>
        </div>
    </div>
</div>
 
        )}
        {step == 5 && loading && (
<div className='flex justify-center'>
    <div className="border border-white mockup-browser shadow-lg rounded-xl w-1/2 h-[75vh] overflow-hidden mt-10">
        <div className="mockup-browser-toolbar ">
            <div className="input">https://tokenbuddy.com/deploying</div>
        </div>
        <h2 className=" border-t font-retro text-white text-5xl flex justify-center px-4 py-6">Deploying...</h2>
        <div className="join flex justify-center py-6 px-4 rounded-b-xl">
           
                
          <span className="loading-lg loading loading-spinner text-secondary"></span>
        </div>
    </div>
</div>
        )}

        {step == 5 && txSuccess && (
            <div className='flex justify-center'>
           <div className="mockup-browser border border-base-300 mt-8 w-1/2">
  <div className="mockup-browser-toolbar">
    <div className="input border border-base-300">https://tokenbuddy.com/success</div>
  </div>
   <h2 className=" border-t font-retro text-white text-5xl flex justify-center px-4 py-6">Success!</h2>
  <div className='flex flex-col items-center pb-5'>
 <span className='font-retro text-white text-2xl'>View your token <a target='_blank' href={`https://sepolia.etherscan.io/token/${tokenAddress}`}><i>here</i></a></span>
<button className='bg-purple-500 text-white font-bold rounded shadow-lg hover:bg-purple-600 w-40 h-10 font-retro text-2xl mt-10' onClick={doItAgain}>Do it again!</button>
</div>

</div>
</div>
        )}
    </div>
  )
}

export default TokenForm