import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import IdiotBoxLayout from './Components/IdiotBoxLayout.js';

class Main {
    run(){
        const container = document.getElementById('react-app');

        const routing = (
            <BrowserRouter>
                <IdiotBoxLayout />
            </BrowserRouter>
        );

        render(routing, container);
    }
}

var main = new Main();
main.run();