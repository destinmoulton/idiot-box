import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import store from './store';

import IdiotBox from './Components/IdiotBox';

class Main {
    run(){
        const container = document.getElementById('react-app');

        const routing = (
            <Provider store={store}>
                <BrowserRouter >
                    <IdiotBox />
                </BrowserRouter>
            </Provider>
        );

        render(routing, container);
    }
}

var main = new Main();
main.run();