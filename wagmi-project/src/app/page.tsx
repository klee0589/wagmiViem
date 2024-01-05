"use client";

import React, { useState } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance, useSendTransaction } from 'wagmi';
import { isAddress } from 'viem';

function App() {
  const account = useAccount();
  const { address } = account;
  const { data, isError, isLoading } = useBalance({
    address,
  });
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const { sendTransaction, error: sendTransactionError } = useSendTransaction();

  const isFormValid = () => {
    return (
      isAddress(recipientAddress) &&
      !isNaN(parseFloat(amount)) &&
      parseFloat(amount) > 0
    );
  };

  const handleSendToken = () => {
    if (isFormValid()) {
      sendTransaction({
        to: recipientAddress,
        value: parseFloat(amount),
      });
    }
  };

  return (
    <div>
      <div>
        <h2>Account</h2>

        <div>
          status: {account.status}
          <br />
          addresses: {JSON.stringify(account.addresses)}
          <br />
          chainId: {account.chainId}
        </div>

        {account.status === 'connected' && (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        )}
      </div>

      {account.status === 'connected' && (
        <div style={{ border: '1px solid white', borderRadius: '20px', display: 'flex', flexDirection: 'column', padding: '10px', margin: '10px' }}>
          <h2>Token Transfer</h2>
          <div>
            Recipient's Wallet Address:
            <input
              type="text"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
            />
          </div>
          <div>
            Amount of USDC to Send:
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <button type="button" onClick={handleSendToken} disabled={!isFormValid()}>
            Send Tokens
          </button>
          {sendTransactionError && <div>Error: {sendTransactionError.message}</div>}
        </div>
      )}

      <div>
        <h2>Connect</h2>
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            type="button"
          >
            {connector.name}
          </button>
        ))}
        <div>{status}</div>
        <div>{error?.message}</div>
      </div>
    </div>
  );
}

export default App;
