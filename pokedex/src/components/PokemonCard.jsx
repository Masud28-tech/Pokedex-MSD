import React, { Component } from 'react';
import axios from 'axios'
import _, { includes } from 'lodash'

const POKEMON_TYPE_TO_COLOR = {
    bug: '#95CD41',
    dark: '#4C0027',
    dragon: 'purple',
    electric: '#FFC900',
    fairy: '#FFCCD2',
    fighting: '#676FA3',
    fire: '#F90716',
    flying: '#84DFFF',
    ghost: '#3F3351',
    grass: '#3E7C17',
    ground: '#9A9483',
    ice: '#B2F9FC',
    normal: '#BFA2DB',
    poison: '#141E61',
    psychic: 'darkmagenta',
    rock: '	#DDDDDD',
    steel: 'lightsteelblue',
    water: '#548CFF'
}
class PokemonCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            pokemonName: "",
            pokemonImgUrl: '',
            pokemonTypes: [],
            pokemonMoves: [],

        };

    }

    // FETCHING RANDOM POKEMON DATA
    async componentDidMount() {
        await this.loadRandomPokemonCard();
    }

    loadRandomPokemonCard = async () => {
        //  TO SHOW LOADING WHILE loadRandomPokemonCard FETCH POKEMON DATA 
        this.setState({ isLoading: true });

        //GETTING ONE RANDOM POKEMON AMONG FIRST 151 POKEMONS FROM 'POKEAPI'
        const randomPokemonId = Math.floor(Math.random() * 151) + 1;
        const pokemon = (
            await axios
                .get(`https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`)
        ).data;

        //GENERATING POKEMON MOVES OF THAT RANDOM POKEMON
        const fourRandomPokemonMoves = [];
        const allPokemonMoves = pokemon.moves;
        while (fourRandomPokemonMoves.length < 4) {
            const randomMove = allPokemonMoves[Math.floor(Math.random() * allPokemonMoves.length)];
            if (!_.includes(fourRandomPokemonMoves, randomMove)) {
                fourRandomPokemonMoves.push(randomMove);
            }
        }
        const pokemonMoves = [];
        await Promise.all(_.map(fourRandomPokemonMoves, async randomPokemonMove => {
            const move = (
                await axios
                    .get(`https://pokeapi.co/api/v2/move/${randomPokemonMove.move.name}`)
            ).data;
            pokemonMoves.push({
                name: move.name,
                power: move.power,
                type: move.type.name,
            });
        }));

        this.setState({
            isLoading: false,
            pokemonName: pokemon.name,
            pokemonImgUrl: pokemon.sprites.front_default,
            pokemonTypes: pokemon.types.map(type => type.type.name),
            pokemonMoves: pokemonMoves
        });
    }

    render() {

        return (
            <>
                {/* BUTTON TO GENERATE RANDOM POKEMON ON CLICK */}
                <button button
                    type='button'
                    onClick={this.loadRandomPokemonCard}
                    className=" bg-red-600 hover:bg-red-800 border-black border-4 rounded-xl m-2 p-2 text-white"
                >
                    Choose your Pokemon
                </button >

                {
                    this.state.isLoading ? (
                        <div className='text-6xl font-bold p-1'>
                            Loading....
                        </div>
                    ) : (
                        <>
                            {/* DISPLAYING POKEMON CARD */}
                            <div className="w-80 border-black border-4 rounded-xl p-4 text-black bg-gradient-to-r from-orange-400 ..." >

                                {/* POKEMON NAME */}
                                <div className="auto text-6xl text-black font-bold" style={{fontFamily: 'Mochiy Pop P One', fontSize:'50px'}}>
                                    {this.state.pokemonName}
                                </div>

                                {/* POKEMON IMAGE */}
                                <div className="border-black border-2 rounded-xl m-1" style={{ backgroundImage: `linear-gradient(to right, ${POKEMON_TYPE_TO_COLOR[this.state.pokemonTypes[0]]}, white`, }}
                                >
                                    <img src={this.state.pokemonImgUrl} alt='' className="mx-auto" />
                                </div>

                                {/* POKEMON TYPES */}
                                <div className='flex flex-row border-2 justify-center'>
                                    {_.map(this.state.pokemonTypes, pokemonType => {
                                        return (

                                            <div key={pokemonType} className="border-black border-2 p-1 m-1 rounded-xl" style={{ backgroundImage: `linear-gradient(to right, ${POKEMON_TYPE_TO_COLOR[pokemonType]}, white`, }}>
                                                {pokemonType}
                                            </div>
                                        );
                                    })
                                    }
                                </div>

                                {/* POKEMON MOVES */}
                                <div className='border-2'>
                                    {
                                        _.map(this.state.pokemonMoves, pokemonMove => {
                                            return (
                                                <div key={pokemonMove.name} className={"border-black border-2 flex flex-row m-1 p-1 rounded-xl justify-between px-1"} style={{ backgroundImage: `linear-gradient(to right, ${POKEMON_TYPE_TO_COLOR[pokemonMove.type]}, white`, }}>
                                                    <div>
                                                        {pokemonMove.name}
                                                    </div>

                                                    <div>
                                                        {pokemonMove.power}
                                                    </div>
                                                </div>

                                            );
                                        })
                                    }
                                </div>
                            </div>

                        </>
                    )
                }

            </>
        );
    }
}

export default PokemonCard;
