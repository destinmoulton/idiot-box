import React from 'react';

import { Layout, Spin } from 'antd';
const { Content } = Layout;

const IdiotBoxLoading = () => {
    return (
        <div>
            <Layout>
                <Content>
                    <Spin /><br/>
                    <span>Loading Idiot Box...</span>
                </Content>
            </Layout>
        </div>
    );
};

export default IdiotBoxLoading;