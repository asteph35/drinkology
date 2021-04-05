import React, { Component } from "react"
import { Col, Row, Button } from 'react-bootstrap'
import DrinkTable from '../components/drinktableV2'
import { withRouter, useHistory } from 'react-router-dom';
import Autocomplete from '../components/autocomplete'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/allPage.css'

 
class allPage extends Component {
    constructor(props) {
        super(props);
        //allSearchTerms = for testing autocomplete
        this.allSearchTerms =[
            'Margarita',
            'Shot glass',
            'Non Alcoholic'
        ];
        this.state = {
        //used to populate drinks table
        drinks: [],
        categories: [
            {
                "category": "s",
                "name": "Drink Name"
            },
            {
                "category": "c",
                "name": "Drink Category"
            },
            {
                "category": "a",
                "name": "Contains Alcohol"
            },
            {
                "category": "g",
                "name": "Glass Type"
            }],

        //Used for drink search
        searchCategory: '',
        searchTerm: '',
        filteredDrinks: [],
        
        location: React.PropTypes,

        //for Autocomplete
        allTerms: [],
        suggestions: [],
      }
    }
    


    componentDidMount() {

        if (!this.props.match.params.element && (this.state.drinks === undefined || this.state.drinks.length == 0)) {
            this.loadAllDrinks()
        }
        else {
            this.loadDrinksFromURL();

        }
    }

    loadDrinksFromURL = () => {
        let element = this.props.match.params.element
                if(element){
                    element = element.replace(/%20/g, " ");
                }
                // if(this.props.match.params){
                this.setState({
                    searchTerm: this.props.match.params.element,
                    searchCategory: this.props.match.params.category
        
                }, () => {
                    this.getDrinks();
                })
    }
    
    componentDidUpdate(prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            if (!this.props.match.params.element) {
                this.setState({
                    searchTerm: "",
                    searchCategory: ""
        
                }, () => {
                    this.loadAllDrinks()
                })
                
            }else{
                this.loadDrinksFromURL();
            }
            this.setState({location: prevProps.location.pathname});
        }
    }


    //Retrienve list of all drinks from API
    loadAllDrinks = (event) =>  {
        fetch("https://www.thecocktaildb.com/api/json/v2/9973533/search.php?s=")
          .then(data => data.json())
          .then(data => {
           console.log(data.drinks)
            this.setState({drinks: data.drinks})
          })
    }
    
    //For Autocomplete
    onTextChange = (event) => {
        const value = event.target.value
        let suggestions = [];
        if (value.length > 0) {
            const regex = new RegExp(`^${value}`, 'i');
            suggestions = this.allSearchTerms.sort().filter(v => regex.test(v));
        }
        this.setState(() => ({ suggestions, searchTerm: value }))  
    } 

    //For Autocomplete
    suggestedSelected = (search) => {
        this.setState(() => ({
            searchTerm: search,
            suggestions: []
        }))
    }


    //For changing category on searches
    changeCategory = (event) => {
        console.log(`Current search Category: ${this.state.searchCategory}`)
        let value = event.currentTarget.value;
        console.log(`value: ` + value)

        this.setState( prevState => { return { searchCategory:  value }}       
        );
    }

    //For retrieving drinks from API based on search category and input from user
    getDrinks = (event) => {
        console.log(`search category = ${this.state.searchCategory}`)
        console.log(`search term = ${this.state.searchTerm}`)
        if (this.state.searchCategory === "s") {
            fetch("https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + this.state.searchTerm)
            .then(data => data.json())
            .then(data => {
             console.log(data.drinks)
              this.setState({drinks: data.drinks})
            }) 
        }
        else {
            fetch("https://www.thecocktaildb.com/api/json/v1/1/filter.php?" + this.state.searchCategory + "=" + this.state.searchTerm)
            .then(data => data.json())
            .then(data => {
                console.log(data.drinks)
                    this.setState({ filteredDrinks: data.drinks, drinks: [] }, () => {
                        console.log(`${this.state.filteredDrinks}`);
                        this.state.filteredDrinks.forEach(drink => {
                            console.log('drink : ' + drink.strDrink)
                            fetch("https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + drink.idDrink)
                                .then(data => data.json())
                                .then(data => {
                                    this.setState({
                                        drinks: this.state.drinks.concat(data.drinks)
                                      })
                                }) 
                        })
                });
            })

            
        }
    }


    
    render() {
        let { drinks, searchTerm, suggestions } = this.state;

        return (
            <div>

                <div id="all_page">
                    <h1 id="all_page_title">Available Drinks</h1>
                    <Col md={{ span: 6, offset: 3 }}>
                        <Row className="drinkSearch">
                            <Col>
                                <select className="form-select form-control mr-2" value={this.state.searchCategory} onChange={this.changeCategory} >
                                    <option value="" key="-1" disabled >Select Category...</option>
                                    {this.state.categories.map((category, index) => {
                                        if(category){
                                            return <option key={index} value={category.category}>{category.name}</option>
                                        }
                                    })}
                                </select>
                            </Col>
                            <Col>
                                <Autocomplete 
                                    inputChange={this.onTextChange}
                                    suggestions={suggestions}
                                    suggestedSelected={this.suggestedSelected}
                                    searchTerm={searchTerm}
                                />
                            </Col>
                            <Button id="drinkSearchButton" size="sm" onClick={this.getDrinks}>Search Drinks</Button>
                        </Row>
                    </Col>

                    <DrinkTable drinkData = {drinks}></DrinkTable>
                    <Button id="searchDrinkButton"variant="Secondary" onClick={this.loadAllDrinks}>See All Drinks</Button>
                </div>
            </div>

        )
    }
}
 
export default withRouter(allPage)