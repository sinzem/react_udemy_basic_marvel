import { Component } from 'react';

import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './charList.scss';

class CharList extends Component  {

    state = {
        chars: [], 
        loading: true,
        error: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.updateChars();
    }

    onCharsLoaded = (chars) => {
        this.setState({
            chars, 
            loading: false
        });
    }

    onCharsLoading = () => {
        this.setState({
            loading: true,
            error: false
        })
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        });
    }

    updateChars = () => {
        this.onCharsLoading();
        this.marvelService
            .getAllCharacters() 
            .then(this.onCharsLoaded) /* (в промисах пришедший результат автоматически подставится аргументом в вызываемую функцию) */
            .catch(this.onError);
    }

    render() {

        const {chars, loading, error} = this.state; 
        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(loading || error) ? <View chars={chars} /> : null;

        return (
            <div className="char__list">
                
                {errorMessage}
                {spinner}
                {content}
               
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }

}

const View = ({chars}) => {

    const processedThumbnail = (char) => {
        return (char.thumbnail && char.thumbnail.indexOf("not available") === -1) 
                                ? {objectFit: "fill", alignSelf: "center"} : null;
    }
    
    return ( 
        <ul className="char__grid">
            {chars.map(char => 
                <li className="char__item" key={char.id}>
                    <img src={char.thumbnail} alt={char.name} style={processedThumbnail(char)} />
                    <div className="char__name">{char.name}</div>
                </li>
            )}
        </ul> 
    )
     
}

export default CharList;