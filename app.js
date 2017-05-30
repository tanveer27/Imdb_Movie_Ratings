new Vue({
	el: '#app',
	data:{

		Movies: [],
		nameFilter:'',
		formErrors:{},
		formErrorsUpdate:{},
		newMovie : {'Rank':'','title':'','Id':''},
		fillMovie : {'Rank':'','title':'','Id':'','index':''}

	},
	mounted () {
		axios.get('/Imdb_Movies/moviedata.json').then(({data}) => {
			var list = data;
			var parsedlist = [];
			list.forEach(function(elem) {
				elem.rank = parseInt(elem.rank);
				parsedlist.push(elem);
			});
			this.Movies = parsedlist;
		});

	},
	computed: {

    		

   	filterMovie: function(){

   		var list = this.Movies;
   		var options = {
   			extract: function(el) { return el.title; }
   		};
   		var results = fuzzy.filter(this.nameFilter, list, options);
   		var matches = results.map(function(el) { return el.original; });
  		 			
  		 			return matches;


    		
   		},

   	},	
   	methods : {

          orderDesc: function () {
          	this.Movies= _.orderBy(this.Movies, ['rank'],['desc']);
          },
          orderAsc: function () {
          	this.Movies= _.orderBy(this.Movies, ['rank'],['asc']);

          },
          sortNameAsc: function () {
          	this.Movies= _.sortBy(this.Movies, ['title'],['asc']);

          },
          getMovie: function(id){
          	return this.Movies.filter(function(p){
          		return p.id===id;
          	}	)  
          },

          createMovie: function(){

          	$("#add-Movie").modal('show');
          },

          addMovie: function(){
          	var input = this.newMovie;
          	var movie={'rank': input.Rank, 'title': input.title, 'id': input.Id};
          	this.orderAsc();
          	if((input.Rank<=window.LastRank)){
          		this.Movies.forEach((v,i,a)=>{
          			if(v.rank >= input.Rank){
          				v.rank++;
          			}
          		});
          		this.Movies.push(movie);
          		window.LastRank++;
              
                $("#add-Movie").modal('hide');
            
            }
            else{
            	$("#add-Movie").modal('hide');
            	alert('invalid rank');
            }

        },
        editMovie: function(Movie){
        	this.orderAsc();
        	this.fillMovie.Rank = Movie.rank;
        	this.fillMovie.title = Movie.title;
        	this.fillMovie.Id = Movie.id;
        	this.fillMovie.index=this.Movies.indexOf(Movie);
                // this.fillMovie.credit = Movie.credit;
                $("#edit-Movie").modal('show');
            },
            updateMovie: function(index){
            	var input = this.fillMovie;
            	if(input.Rank<window.LastRank){
            		var updatedMovie={'id': input.Id, 'rank': input.Rank, 'title': input.title};

            		if(input.Rank > this.Movies[index].rank){
            			var temp = this.Movies[index].rank;
            			var temp2 = this.Movies[index].rank;
            			newindex = index + (input.Rank - temp);	
            			while(temp < input.Rank){
            				this.Movies[newindex].rank = this.Movies[newindex-1].rank;
            				this.Movies[newindex-1].rank = temp2;
            				temp++;
            				newindex--;
            			}
            		} 
            		if(input.Rank < this.Movies[index].rank){
            			var temp = this.Movies[index].rank;
            			var temp2 = this.Movies[index].rank;
            			newindex = index - (temp-input.Rank);	
            			while(temp > input.Rank){
            				this.Movies[newindex].rank = this.Movies[newindex+1].rank;
            				this.Movies[newindex+1].rank = temp2;
            				temp--;
            				newindex++;
            			}
            		}
            		this.Movies.splice(index, 1, updatedMovie);


            		$("#edit-Movie").modal('hide');
            		this.orderAsc();

            	}
            	else{
            		$("#edit-Movie").modal('hide');
            		alert('Invalid Rank');
            	}
            },
            deleteMovie: function(Movie){
            	this.Movies.forEach((v,i,a)=>{
            		if(v.rank > Movie.rank){
            			v.rank--;
            		}
            	});

            	this.Movies.splice(this.Movies.indexOf(Movie), 1);
            	window.LastRank--;

            },
          
        }
    })