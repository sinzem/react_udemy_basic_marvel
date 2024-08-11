import { Component } from "react";

import ErrorMessage from "../errorMessage/ErrorMessage";

/* (для работы с ошибками - при подключении компонентов или классов на страницах оборачиваем их в ErrorBoundary(пример в App.js), отслеживает только ошибки внутри рендера или жц, остальные прописываем отдельно(например события клика или асинхронные операции)) */
class ErrorBoundary extends Component {

    state = {
        error: false
    }

    componentDidCatch(error, errorInfo) {
        console.log(error, errorInfo);

        this.setState({
            error: true
        })
    }

    render() {
        if (this.state.error) {
            return <ErrorMessage />
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
