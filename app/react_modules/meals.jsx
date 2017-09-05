import React from 'react'
import axios from 'axios'

export default class RecipesPage extends React.Component{
	constructor(props){
		super(props);
		this.state = {"recipes": ["test"]}
	}

	addRecipe(item){
		this.setState((prev)=>{
			return prev.recipes.push(item)
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
		rows.push(<tr key={item}><td>{item}</td></tr>)
	})
	return <table><tbody>{rows}</tbody></table>
}

class NewRecipe extends React.Component{
	constructor(props){
		super(props);
		this.state = {"ingredients": [], "mealname": "", "ingredient": ""}
	}

	saveRecipe(){
		this.props.addRecipe(this.state.mealname)
		this.setState((prev)=>{
			prev.mealname = ""
			prev.ingredients = []
			prev.ingredient = ""
			return prev
		})
	}

	addItem(){
		this.setState((prev)=>{
			prev.ingredients.push(prev.ingredient)
			prev.ingredient=""
			return prev
		})
	}
	updateInput(e){
		//this.setState({e.target.name: e.target.value})
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
			</div>)
	}
}
