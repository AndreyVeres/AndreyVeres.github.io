import './charInfo.scss';
import MarvelService from '../../services/MarvelService';
import Error from '../error/Error';
import Spinner from '../spinner/Spinner';
import Skeleton from '../skeleton/Skeleton'
import { Component } from 'react';

class CharInfo extends Component {

    state = {
        char: null,
        loading: false,
        error: false
    }

    marvelService = new MarvelService()

    componentDidMount() {
        this.updateChar()
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.charId !== prevProps.charId) {
            this.updateChar()
        }

    }


    updateChar = () => {
        const { charId } = this.props
        if (!charId) {
            return
        }
        
        this.setState({
            loading: true
        })
        this.marvelService.getCharacter(charId)
            .then(this.onCharLoaded)
            .catch(this.onError)

            //  this.foo.bar = 0;
    }

    onCharLoaded = (char) => {
        this.setState({
            char,
            loading: false
        })
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }


    render() {
        const { char, loading, error } = this.state;

        const skeleton = char || loading || error ? null : <Skeleton />;
        const errorMessage = error ? <Error /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(loading || error || !char) ? <View char={char} /> : null;
        console.log(skeleton)

        return (
            <div className="char__info">
                {skeleton}
                {errorMessage}
                {spinner}
                {content}
               
            </div>
        )
    }
}



const View = ({ char }) => {

    const { name, description, thumbnail, homepage, wiki, comics } = char
    let imgStyle = { objectFit: 'cover' };
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = { objectFit: 'unset' };
    }
    const comicsList = comics.map((item, id) => {



        return (

            <li key={id} className="char__comics-item" style={imgStyle}>
                {item.name}
            </li>
        )
    })




    const renderedComics = comics.length ? comicsList : 'Нету комиксов об этом персонаже'

    
    return (
        <> 
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle} />
                <div>

                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {renderedComics}
            </ul>
        </>
    )
}




export default CharInfo;


