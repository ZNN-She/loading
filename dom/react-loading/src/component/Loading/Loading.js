/*
* type: String loading的类型 default progress 默认default
* size: String loading的大小 default large small
* text: String 显示的文本
* horizontal: Boolean 文字和loading图标是在一行还是两行 true:一行  默认true
* content: Element 自定义loading内容 默认null
* loading: Promise/Boolean hand为false时传Promise对象，hand为true时传Boolean，true显示，false隐藏
* progress: Number 可以自定义进度
*/

import React, {Component} from 'react';

import "./Loading.css";

class Loading extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            width: 0,
            setInterval: null
        };
        this.setInterval = null;
    }

    componentDidMount() {
        this.init(this.props);
    }

    componentWillUnmount() {
        this.setState({
            loading: false
        });
    }

    componentWillReceiveProps(nextProps) {
        this.init(nextProps);
    }

    init = (props) => {
        //判断是否是Promise对象
        if (props.loading && props.loading.then) {
            this.loading(props.loading);
        } else {
            //需要手动隐藏
            this.setState({
                loading: props.loading
            });
        }
        //进度条
        if (props.type === "progress") {
            this.initProgress(props);
        }
        this.countPosition();
    };

    initProgress = (props) => {
        if(props.progress){
            this.setState({
                width: props.progress
            });
        }else {
            //重置进度
            this.setState({
                width: 0
            });
            clearInterval(this.setInterval);
            this.setInterval = setInterval(() => {
                this.setState({
                    width: ++this.state.width
                });
                if (this.state.width >= 95) {
                    clearInterval(this.setInterval);
                }
            }, 15);
            this.setState({
                setInterval: this.setInterval
            })
        }
    };

    loading = (promise) => {
        if (promise && promise.then) {
            this.setState({
                loading: true
            });
            promise.then(() => {
                this.setState({
                    loading: false
                })
            }).catch(() => {
                this.setState({
                    loading: false
                })
            });
        }
    };

    //动态计算图标位置 上下居中
    countPosition = () => {
        let elements = document.getElementsByClassName("znn-loading");
        for (let i = 0; i < elements.length; i++) {
            let ele = elements[i];
            let height = ele.clientHeight;
            if (ele.getElementsByClassName("znn-loading-content").length) {
                let loadingContent = ele.getElementsByClassName("znn-loading-content")[0];
                loadingContent.style.paddingTop = height / 2 - 30 + "px";
            }
        }
    };


    render() {
        let type = this.props.type || "default";
        let size = this.props.size || "default";
        let text = this.props.text || "数据加载中，请稍后...";
        let horizontal = String(this.state.horizontal) === "false" ? false : true;
        let content = this.props.content;
        let width = this.state.width;

        let showClass = this.state.loading ? " znn-loading-show" : "";
        let typeClass = " znn-loading-" + type;
        let sizeClass = " znn-loading-" + size;
        let horizontalClass = horizontal ?  " znn-loading-horizontal" : "";
        return (
            <div className={"znn-loading" + showClass + typeClass + sizeClass + horizontalClass}>
                {
                    !Boolean(content) &&
                    <div className={"znn-loading-content"}>
                        <div className="znn-jq-loading-inner">
                            {
                                type !== "progress" &&
                                <div className="znn-loading-circle"></div>
                            }
                            {
                                type === "progress" &&
                                <div className="znn-loading-content-progress">
                                    <div className="znn-loading-progress-label" style={{width: width + "%"}}></div>
                                </div>
                            }
                            <div className="znn-loading-text">{text}</div>
                        </div>
                    </div>
                }
                {
                    Boolean(content) &&
                    <div className={"znn-loading-content"}>
                        {content}
                    </div>
                }
                {this.props.children}
            </div>
        );
    }
}

export default Loading;
