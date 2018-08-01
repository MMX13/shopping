import React from 'react'
import axios from 'axios'
import {ItemInput} from './items'

export default class RecipesPage extends React.Component{
	constructor(props){
		super(props);
		this.state = {"recipes": [],
						"recipe": {
							"method": "create",
							"show": false,
							"current": null
						}
					}
	}

	componentDidMount(){
		var recipes = []
		axios.get('/api/meals')
			.then((res)=>{
				this.setState({"recipes": res.data})
			})
	}

	addRecipe(item){
		console.log(item)
		axios.post('/api/meals', item)
			.then((res)=>{
				this.setState((prev)=>{
					return prev.recipes.push(item)
				})
				this.toggleAdd()
		})
	}
	showModify(item){
		this.setState((prev)=>{
			prev.recipe = {"method": "update",
						   "show": true,
						   "current": item}
			return prev
		})
	}
	modifyRecipe(item){
		axios.put('/api/meals', item)
			.then((res)=>{
				this.setState({"recipe":
								{"method": "update",
								 "show": false,
								 "current": null
								}
							})
			})
	}
	deleteRecipe(meal){
		axios.delete('/api/meals/' + meal.mealname)
			.then((res)=>{
				this.setState((prev)=>{
					return prev.recipes.splice(prev.recipes.indexOf(meal), 1)
				})
			})
	}
	toggleAdd(){
		this.setState((prev)=>{
			prev["recipe"]["show"] = !prev["recipe"]["show"]
			prev["recipe"]["current"] = null
			return prev
		})
	}

	prepareBody(){
		var body = []
		body.push(<RecipeList key="recipes" recipes={this.state.recipes} 
							  showModify={this.showModify.bind(this)}
							  deleteRecipe={this.deleteRecipe.bind(this)}/>)
		if(this.state.recipe.show){
			if(this.state.recipe.method=="create"){
				var f = this.addRecipe
			} else if (this.state.recipe.method=="update"){
				var f = this.modifyRecipe
			}
			body.push(<NewRecipe key="new" addRecipe={f.bind(this)} recipe={this.state.recipe.current} />)
			body.push(<button key="cancel" onClick={this.toggleAdd.bind(this)}>Cancel</button>)
		} else {
			body.push(<button key="add" onClick={this.toggleAdd.bind(this)}>Add Recipe</button>)
		}
		return body
	}


	render() {
		return (<div>
					{this.prepareBody()}
				</div>)
	}
}

var RecipeList = (props) => {
	var rows = []
	props.recipes.forEach((item)=>{
		rows.push(
			<tr key={item.mealname}>
				<td>{item.mealname}</td>
				<td><a onClick={() => props.showModify(item)}>Modify</a></td>
				<td><a onClick={() => props.deleteRecipe(item)}>Delete</a></td>
			</tr>
			)
	})
	return <table><tbody>{rows}</tbody></table>
}

class NewRecipe extends React.Component{
	constructor(props){
		super(props);
		this.state = {"ingredients": [], 
					  "mealname": "", 
					  "ingredient": "",
					  "quantity": 0,
					  "unit": "",
					  "newIngredient": false,
					  "suggestions": []
					}
		if(props.recipe!=null){
			this.state.ingredients = props.recipe.ingredients
			this.state.mealname = props.recipe.mealname	
		}
	}

	componentDidMount(){
		axios.get('/api/items')
			.then((res)=>{
				this.setState({"suggestions": res.data})
			})
	}

	saveRecipe(){
		var recipe = {ingredients: this.state.ingredients,
				  mealname: this.state.mealname}
		this.props.addRecipe(recipe)
		this.setState((prev)=>{
			prev.mealname = ""
			prev.ingredients = []
			prev.ingredient = ""
			return prev
		})
	}

	addItem(){
		console.log(this.state)
		axios.get("/api/items/"+this.state.ingredient)
			.then((res)=>{
				var item = {"name": this.state.ingredient,
						"quantity": this.state.quantity}
				console.log(item)
				var i = -1
				for(var x=0; x<this.state.ingredients.length; x++){
					if(this.state.ingredients[x].name == this.state.ingredient){
						i = x;
						break
					}
				}
				if(i>-1){
					this.setState((prev)=>{
						prev.ingredients[i] = item
						prev.ingredient = ""
						prev.quantity = 0
						return prev
					})
				} else {
					this.setState((prev)=>{
						prev.ingredients.push(item)
						prev.ingredient = ""
						prev.quantity = 0
						return prev
					})
				}
			})
			.catch((res)=>{
				console.log(res)
				this.setState({"newIngredient": true,
							   "ingredient": "",
							   "quantity": 0})
			})
	}

	modifyIngredient(ingredient){
		this.setState({"ingredient": ingredient.name,
					   "quantity": ingredient.quantity})
	}

	deleteIngredient(target){
		this.state.ingredients.forEach((ingredient, i)=>{
			if(ingredient.name == target){
				this.setState((prev)=>{
					prev.ingredients.splice(i, 1)
					return prev
				})
			}
		})
	}
	onIngredientCreation(item){
		this.setState((prev)=>{
			console.log(item)
			prev.ingredient = item.name
			prev.newIngredient = false
			console.log(prev.suggestions)
			prev.suggestions.push(item)
			console.log(prev.suggestions)
			return prev
			})
	}

	updateInput(e){
		this.setState({[e.target.name]: e.target.value})
	}

	itemBlur(e){
	}

	render() {
		var rows = []
		this.state.ingredients.forEach((item)=>{
			rows.push(<tr key={item.name}>
						<td>{item.name}</td>
						<td><a onClick={()=>this.modifyIngredient(item)}>Modify</a></td>
						<td><a onClick={()=>this.deleteIngredient(item.name)}>Delete</a></td></tr>)
		})
		var suggestions = []
		var unit = ""
		this.state.suggestions.forEach((item)=>{
			suggestions.push(<option>{item.name}</option>)
			if(item.name==this.state.ingredient){
				unit = item.unit
			}
		})
		return (
			<div>
				<input name="mealname" value={this.state.mealname} onChange={this.updateInput.bind(this)}></input>
				<h3>Ingredients</h3>
				<table><tbody>{rows}</tbody></table>
				<input list="suggestions" name="ingredient" value={this.state.ingredient} onChange={this.updateInput.bind(this)} onBlur={this.itemBlur.bind(this)}></input>
				<datalist id="suggestions">{suggestions}</datalist>
				{unit && <input name="quantity" value={this.state.quantity} onChange={this.updateInput.bind(this)} />}
				{unit}
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
			category: item.category,
			unit: item.unit
		}).then((res)=>{
			props.onIngredientCreation(item)
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