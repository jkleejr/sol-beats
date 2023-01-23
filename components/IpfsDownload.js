import React from 'react';
import useIPFS from '../hooks/useIPFS';


// downloading files from IPFS using hash and filename to public IPFS gateway URL
const IPFSDownload = ({hash, filename}) => {
    const file = useIPFS (hash, filename);

    return(
        <div>
        {file ? (
            <div className= "download-component">
                <a className= "download-button" href= {file} download= {filename}>Download</a>
            </div>
        ) : (
            <p>
                Downloading file...
            </p>
        )}
        </div>
    );
};
// returns link to download file


export default IPFSDownload;
