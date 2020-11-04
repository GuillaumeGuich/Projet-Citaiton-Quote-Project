Vue.component('main-citation',{
template: `<div class="row">
<div class="titrecat col-lg-12">
<h5>{{nomcategorie}}</h5><br/>
</div>
<div class="row affichage">
<boutonlike v-on:likeButton='ajoutlike'></boutonlike>
<div class="col-6">
<div class="citation">
<i>{{citation.content}}</i>
<br/>
<span class="auteur">{{name}}</span>
</div>
</div>
<div class="col-3">
<div class="random">
<button type="button" class="btn btn-info" v-on:click="recharger()" :key="refrcompo"> <i class="fas fa-random"></i></button>
<div class="info" id="aleatip"><p>Nouvelle citation</p></div>
</div>
</div>
</div>
</div>
`,
props: ['nomcategorie'],
data: function(){return{
  refrcompo:0,
  citation:'',
  name:''
}},
created () {
  if (this.nomcategorie.length > 1){
      console.log(this.nomcategorie);
  }

  var options = {
    method: 'GET',
    url: 'https://rapidapi.p.rapidapi.com/quotes/random/',
     params: {language_code: 'fr'},
    headers: {
      'x-rapidapi-host': 'quotes15.p.rapidapi.com',
      'x-rapidapi-key': '35a0686eedmshfef92bbe71c26dcp1f8dfejsnb11caee38877'
    }
  };

  axios.request(options).then(response => (this.citation = response.data)&&(this.name = response.data.originator.name))
  .catch(function (error) {
    console.error(error);
  });
},
methods:{
  recharger: function(){
        this.$emit('recharger');
      },
      ajoutlike: function(citation,name){
        this.$emit('ajoutLike',this.citation,this.name)
      },

}
})

Vue.component('boutonlike',{
template:`    <div class="col-3">
  <div class="like">
  <button type="btn button" class="likebutton" v-on:click="likebutton()"><i class="fas fa-heart"></i></button>
  <div class="info" id="favoritip"><p>Mettre en favori</p></div>
  </div>
  </div>`,
methods:{
likebutton: function(){
  console.log('like');
  $(".likebutton").addClass("disabledcoeur");
    $(".likebutton").attr("disabled", true);
  this.$emit('likeButton');
},

}
})

Vue.component('renducitlike',{
template:`<div class="row affichage">
<h2 class="col-12"><i class="fas fa-heart coeurmenu"></i>Citations favorites<i class="fas fa-heart coeurmenu"></i></h2><br/><br/>
<renducitunique v-bind:citations="passecitations" v-on:emetdelete="suppcit(index)" v-for="(citation,index) in citations" :citation="citation" :key="citation.id"></renducitunique>
<div v-if="citations.length < 1" class="col-12 aucunecit"><h4>Aucune citation favorite</h4></div>
</div>
</div>`,
props: ['citations'],
data: function () {
    return {
        passecitations: this.citations[0],

    }
},
methods:{
suppcit: function(index) {
this.citations.splice(index,1);
},
}
})

Vue.component('renducitunique',{
template:`<div class="col-12">
<div class="citation">
<i>{{this.cita.cit}}</i>
<br/>
<span class="auteur">{{this.cita.auteur}}</span>
<br/>
<button v-on:click="emetdelete(index)" class="btn btn-info supprimercit"><i class="fas fa-trash"></i> Suprimer la citation</button>
</div>
<br/><br/>
</div>`,
props: ['citation','index'],
data: function () {
    return {
        cita: this.citation,
        ind: this.index
    }
},
methods: {
emetdelete: function(index) {
 this.$emit('emetdelete',index);
},
}
})



Vue.component('nav-bar',{
template: `                  <nav id="sidebar">
                    <div class="sidebar-header">
                        <h2 class="text-center">Menu</h2>
                          <ul class="nav flex-column cat">
                                <li class="nav-item"><button class="btn catbutton" v-on:click="pagelike()"><i class="fas fa-heart coeurmenu"></i> Citations favorites</button>
                                <li class="nav-item" v-for="categorie in lescategories">
                                  <button type="button" class="btn catbutton" v-on:click="changerpage(categorie)">{{categorie}}</button>
                                </li>
                               </ul>
                        </div>
                 </nav>
`,
props: ['lescategories'],
methods: {
changerpage: function(categorie) {
this.$emit('pagechangee',categorie);
},
pagelike: function() {
this.$emit('afficherLike');
},
}

})

var app = new Vue({
el: '#app',
template:`<div class="container-fluid">
  <nav-bar v-bind:lescategories="categories" v-on:pagechangee="changerpage" v-on:afficherLike="pagelikes"></nav-bar>

     <div id="content">
       <div class="row">
        <div class="col-lg-12">
          <h1 class="text-center">Projet Citations</h1></br>
        </div>
      </div>
    <renducitlike v-if="pagecitlike === true" v-bind:citations="citlikes"></renducitlike>
    <main-citation v-else v-on:ajoutLike="tablike" v-on:recharger="rafraichi" v-bind:nomcategorie="nompage" :key='rcompo'></main-citation>
    </div>
    </div>
    </div>
  </div>`,
data: function(){return{
titre: 'Test',
categories: ['Aléatoire','Humour','Romance','Historique','Vie'],
nompage:'',
rcompo:0,
citlikes:[],
idlike: 0,
pagecitlike: false
}
},
methods:{
rafraichi: function(){
  this.rcompo = this.rcompo + 1;
},
changerpage: function(categorie){
  this.nompage = categorie;
  this.pagecitlike = false;
},
tablike: function(citation,name){
  idlike = this.idlike ++;
  this.citlikes.push({cit:citation.content, auteur:name, id:this.idlike});
},
pagelikes: function(){
this.pagecitlike = !this.pagecitlike;
},
}
})
