import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { NoiaClient, NoiaClientContainer } from "@noia-network/sdk";
// eslint-disable-next-line
import * as PieceWorker from "worker-loader!@noia-network/sdk/worker";
// eslint-disable-next-line
import * as Sha1Worker from "worker-loader!rusha/dist/rusha";
import { LoggerBuilder } from 'simplr-logger';

NoiaClientContainer.initialize(
    new NoiaClient({
        logger: new LoggerBuilder(),
        pieceWorkerConstructor: () => new PieceWorker(),
        sha1WorkerConstructor: () => new Sha1Worker()
    })
);

ReactDOM.render(<App />, document.getElementById('root'));
