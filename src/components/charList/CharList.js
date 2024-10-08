import { Component } from 'react';
import PropTypes from 'prop-types'; /* (модуль для проверки типов входящих пропсов, подключение внизу перед экспортом) */

import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './charList.scss';

class CharList extends Component  {

    state = {
        chars: [], 
        loading: true,
        newItemLoading: false,
        error: false,
        offset: 210,
        charEnded: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.onRequest();
    }

    onCharsLoaded = (newChars) => {
        let ended = false;
        if (newChars.length < 9) {
            ended = true;
        }

        this.setState(({chars, offset}) => ({
            chars: [...chars, ...newChars], 
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }));
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        });
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService
            .getAllCharacters(offset) 
            .then(this.onCharsLoaded) /* (в промисах пришедший результат автоматически подставится аргументом в вызываемую функцию) */
            .catch(this.onError);
    }

    render() {

        const {chars, loading, error, newItemLoading, offset, charEnded} = this.state; 
        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(loading || error) ? <View chars={chars} onCharSelected={this.props.onCharSelected}/> : null;

        return (
            <div className="char__list">
                
                {errorMessage}
                {spinner}
                {content}
               
                <button 
                    disabled={newItemLoading}
                    onClick={() => this.onRequest(offset)}
                    style={{"display": charEnded ? "none" : "block"}}
                    className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }

}

class View extends Component {
    // constructor({chars, onCharSelected}) {
    //     super({chars, onCharSelected});
    // }

    processedThumbnail = (char) => {
        return (char.thumbnail && char.thumbnail.indexOf("not available") === -1) 
                                ? {objectFit: "fill", alignSelf: "center"} : null;
    }

    itemRefs = [];

    setRef = (ref) => {
        this.itemRefs.push(ref);
    }

    focusOnItem = (id) => {
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }

    render() {
        return ( 
            <ul className="char__grid">
                {this.props.chars.map((char, i) => 
                    <li className="char__item" 
                        key={char.id}
                        tabIndex={0}
                        ref={this.setRef} 
                        onClick={() => {
                            this.props.onCharSelected(char.id)
                            this.focusOnItem(i);
                        
                        }}
                        onKeyPress={(e) => {
                            if (e.key === ' ' || e.key === "Enter") {
                                this.props.onCharSelected(char.id);
                                this.focusOnItem(i);
                            }
                        }}>
                        <img src={char.thumbnail} alt={char.name} style={this.processedThumbnail(char)} />
                        <div className="char__name">{char.name}</div>
                    </li>
                )}
            </ul> 
        )
         
    }

 
    

}

CharList.propTypes = {  /* (проверяем тип приходящих пропсов, в случае несоответствия выдаст предупреждение в консоль) */
    onCharSelected: PropTypes.func.isRequired, /* (типизируем, можно добавить флажок, что пропс обязательный(isRequired)) */
}

export default CharList;