import React, {Component} from 'react';

import Loading from "../../component/Loading/Loading";

class TestLaoding extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: null
        };
    }

    componentDidMount() {
        let promise = new Promise((resolve,reject) => {
            setTimeout(() => {
                resolve(); //这里调resolve方法，则then方法会被调用
                console.log('resolve里面的log');
            }, 3000);
        });
        this.setState({
            loading: promise
        })
    }

    componentWillUnmount() {
        console.log("home")
    }

    getList = () => {
        let promise = new Promise((resolve,reject) => {
            setTimeout(() => {
                resolve(); //这里调resolve方法，则then方法会被调用
                console.log('resolve里面的log');
            }, 3000);
        });
        this.setState({
            loading: promise
        })
    };

    render() {
        return (
            <div>
                <Loading loading={true}>
                    <h1 style={{width: 200, height: 200, background:"#ddd"}} onClick={this.getList}>HOME-首页</h1>
                </Loading>
            </div>
        );
    }
}

export default TestLaoding;
