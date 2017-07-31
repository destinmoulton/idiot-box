import React from 'react';

import { Layout, Spin } from 'antd';
const { Content } = Layout;

const IdiotBoxLoading = () => {
    return (
        <div>
            <Layout>
                <Content>
                    <div id="ib-loading-box">
                    <Spin /><br/><br/>
                    <span >Loading Idiot Box...</span>
                    </div>
                </Content>
            </Layout>
        </div>
    );
};

export default IdiotBoxLoading;