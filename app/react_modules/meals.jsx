import React from 'react'
import axios from 'axios'
import {ItemInput} from './items'

export default class RecipesPage extends React.Component{
	constructor(props){
		super(props);
		this.state = {"recipes": ["test"]}
	}

	componentDidMount(){
		axios.get('/api/meals')
			.then((res)=>{
				this.setState({"recipes": res.data})
				console.log(res.data)
			})
	}

	addRecipe(item){
		axios.post('/api/meals', item)
			.then((res)=>{
				this.setState((prev)=>{
			return prev.recipes.push(item)
			})
		})
	}

	render() {
		return (<div>
					<RecipeList recipes={this.state.recipes}/>
					<NewRecipe addRecipe={this.addRecipe.bind(this)}/>
				</div>)
	}
}

var RecipeList = (props) => {
	var rows = []
	props.recipes.forEach((item)=>{
		rows.push(<tr key={item.mealname}><td>{item.mealname}</td></tr>)
	})
	return <table><tbody>{rows}</tbody></table>
}

class NewRecipe extends React.Component{
	constructor(props){
		super(props);
		this.state = {"ingredients": [], 
					  "mealname": "", 
					  "ingredient": "",
					  "newIngredient": false}
	}

	saveRecipe(){
		this.props.addRecipe(this.state)
		this.setState((prev)=>{
			prev.mealname = ""
			prev.ingredients = []
			prev.ingredient = ""
			return prev
		})
	}

	addItem(){
		axios.get("/api/items/"+this.state.ingredient)
			.then((res)=>{
				this.setState((prev)=>{
				prev.ingredients.push(prev.ingredient)
				prev.ingredient = ""
				return prev
				})
			})
			.catch((res)=>{
				this.setState({"newIngredient": true,
							   "ingredient": ""})
			})
	}

	onIngredientCreation(item){
		this.setState((prev)=>{
			prev.ingredients.push(item)
			prev.newIngredient = false
			return prev
			})
	}

	updateInput(e){
		this.setState({[e.target.name]: e.target.value})
	}

	render() {
		var rows = []
		this.state.ingredients.forEach((item)=>{
			rows.push(<tr key={item}><td>{item}</td></tr>)
		})
		return (
			<div>
				<input name="mealname" value={this.state.mealname} onChange={this.updateInput.bind(this)}></input>
				<h3>Ingredients</h3>
				<table><tbody>{rows}</tbody></table>
				<input name="ingredient" value={this.state.ingredient} onChange={this.updateInput.bind(this)}></input>
				<button onClick={this.addItem.bind(this)}>Add</button><br/>
				<button onClick={this.saveRecipe.bind(this)}>Save Recipe</button>
				<CreateIngredient show={this.state.newIngredient} onIngredientCreation={this.onIngredientCreation.bind(this)} />
			</div>)
	}
}

var CreateIngredient = (props) => {
	function addIngredient(item){
		axios.post('/api/items', {
			name: item.name,
			category: item.category
		}).then((res)=>{
			props.onIngredientCreation(item.name)
		})		
	}
	if(props.show)
	{
		return (
			<div>
				<p>We couldn't find that item, perhaps you'd like to add a new one?</p>
				<ItemInput addItem={addIngredient} />
			</div>)
	}
	else
	{
		return null
	}
}