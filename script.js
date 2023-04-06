Vue.component('main-citation', {
  template: `<div class="row">
<div class="titrecat col-lg-12">
<h4>{{nomcategorie}}</h4><br/>
</div>
<div class="row affichage col-lg-12">
<boutonlike v-on:likeButton='ajoutlike'></boutonlike>
<div class="col-lg-6 col-sm-8">
<div class="citation">
<i>{{citation.citation}}</i>
<br/>
<span class="auteur">{{citation.auteur}}</span>
</div>
</div>
<div class="col-lg-3 col-sm-2">
<div class="random">
<button type="button" class="btn btn-info" v-on:click="recharger()" :key="refrcompo"> <i class="fas fa-random"></i></button>
<div class="info" id="aleatip"><p>Nouvelle citation</p></div>
</div>
</div>
</div>
</div>
`,
  props: ['nomcategorie','sdcitlikes'],
  data: function() {
    return {
      refrcompo: 0,
      citation: '',
      name: ''
    }
  },
  created() {
    if (this.nomcategorie.length > 1 & this.nomcategorie != "Aléatoire") {
      axios.get("https://sheetlabs.com/GUIG/citations?genre=" + this.nomcategorie + "&_limit=1&_random=1")
        .then(response => this.citation = response.data[0])
        .catch(function(error) {
          console.error(error);
        });
    } else {
      axios.get("https://sheetlabs.com/GUIG/citations?_limit=1&_random=1")
        .then(response => this.citation = response.data[0])
        .catch(function(error) {
          console.error(error);
        });
    }
  },

updated() {
    for (var i=0; i < this.sdcitlikes.length; i++){
    if(this.sdcitlikes[i].id == this.citation.id){
      $(".likebutton").addClass("disabledcoeur");
      $(".likebutton").attr("disabled", true);
      $("#favtext").text("Citation aimée");
  }}
},
methods: {
    recharger: function() {
      this.$emit('recharger');
    },
    ajoutlike: function() {
      this.$emit('ajoutLike', this.citation.citation, this.citation.auteur,this.citation.id)
    },

  }
})

Vue.component('boutonlike', {
  template: `    <div class="col-lg-3  col-sm-2 liking">
  <div class="like">
  <button type="btn button" class="likebutton" v-on:click="likebutton()"><i class="fas fa-heart"></i></button>
  <div class="info" id="favoritip"><p id="favtext">Aimer la citation</p></div>
  </div>
  </div>`,
  methods: {
    likebutton: function() {
      console.log('like');
      $(".likebutton").addClass("disabledcoeur");
      $(".likebutton").attr("disabled", true);
      $("#favtext").text("Citation aimée");
      this.$emit('likeButton');
    },

  }
})

Vue.component('renducitlike', {
  template: `<div class="row affichage">
<h2 class="col-12"><i class="fas fa-heart coeurmenu"></i>Mes citations aimées<i class="fas fa-heart coeurmenu"></i></h2><br/><br/>
<renducitunique v-bind:citations="passecitations" v-on:emetdelete="suppcit(index)" v-for="(citation,index) in citations" :citation="citation" :key="citation.id"></renducitunique>
<div v-if="citations.length < 1" class="col-12 aucunecit"><h4>Aucune citation aimée</h4></div>
</div>
</div>`,
  props: ['citations'],
  data: function() {
    return {
      passecitations: this.citations[0],

    }
  },
  methods: {
    suppcit: function(index) {
      this.citations.splice(index, 1);
    },
  }
})

Vue.component('renducitunique', {
  template: `<div class="col-12">
<div class="citation citfav">
<i>{{this.cita.cit}}</i>
<br/>
<span class="auteur">{{this.cita.auteur}}</span>
<br/>
<button v-on:click="emetdelete(index)" class="btn btn-info supprimercit"><i class="fas fa-trash"></i> Suprimer la citation</button>
</div>
<br/><br/>
</div>`,
  props: ['citation', 'index'],
  data: function() {
    return {
      cita: this.citation,
      ind: this.index
    }
  },
  methods: {
    emetdelete: function(index) {
      this.$emit('emetdelete', index);
    },
  }
})



Vue.component('nav-bar', {
  template: `
        <div class="row">
          <div class="col-12 px-0">
              <div id="totmenu">
                  <nav id="sidebar" role="navigation">
                        <div class="sidebar-header">
                              <h2 class="text-center titremenu">Menu</h2>
                              <ul class="nav flex-column cat">
                                  <li class="nav-item"><button class="btn catbutton" v-on:click="pagelike()"><i class="fas fa-heart coeurmenu"></i> Mes citations aimées</button>
                                  <li class="nav-item" v-for="categorie in lescategories">
                                    <button type="button" class="btn catbutton" v-on:click="changerpage(categorie)">{{categorie}}</button>
                                  </li>
                              </ul>
                          </div>
                        <div id="signature">
                          <h5>Crée par <a href="https://guillaumeguichard.dev/" target="_blank">Guillaume Guichard</a></h5>
                        </div>
                    </nav>

                    <div class="mobilemenu navbar d-lg-none">
                      <div class="row">
                        <div class="col-3">
                          <button type="button" class="hamburger" data-toggle="collapse" data-target="#myNavbar">
                          <i class="fas fa-bars"></i>
                          </button>
                        </div>
                        <div class="col-9">
                          <svgcit id="svgmobile"></svgcit>
                        </div>
                      </div>

                            <div class="col-12">
                                <div id="myNavbar" class="collapse">
                                  <ul class="nav navbar-nav flex-column cat">
                                      <li class="nav-item"><button class="btn catbutton" v-on:click="pagelike()"><i class="fas fa-heart coeurmenu"></i> Mes citations aimées</button>
                                      <li class="nav-item" v-for="categorie in lescategories">
                                        <button type="button" class="btn catbutton" v-on:click="changerpage(categorie)">{{categorie}}</button>
                                      </li>
                                      </ul>
                                </div>
                            </div>

                      </div>
                  </div>
                  </div>
                  </div>

`,
  props: ['lescategories'],
  methods: {
    changerpage: function(categorie) {
      this.$emit('pagechangee', categorie);
    },
    pagelike: function() {
      this.$emit('afficherLike');
    },
  }

})

Vue.component('svgcit', {
  template: `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 1366 768" style="enable-background:new 0 0 1366 768;" xml:space="preserve">
<g>
	<path d="M354.4,184.5c-4.9,22-20.2,48.3-45.9,78.8c-27.7,32.9-51.3,49.3-70.9,49.3c-11.6,0-17.4-5.5-17.4-16.5
		c0-16.7,15.3-38.8,45.9-66.5c27.4-24.6,51.1-41,71.1-49.1c1.6-3.9,2.4-7.7,2.4-11.4c0-11.1-6.1-16.7-18.4-16.7
		c-26.4,0-62.9,15.3-109.4,45.8c-45.2,29.6-86.9,63.5-125.2,101.4c-35.3,41.6-53,76.2-53,103.7c0,22.2,13.2,33.3,39.6,33.3
		c19.1,0,40-5.1,62.6-15.4c15.8-7.2,32.1-16.9,48.9-28.9l20.7-15.4c2.3,0,3.5,2.1,3.5,6.3c0,10.4-10.3,22.4-30.9,35.9
		c-13.6,9-28.9,17-45.8,24c-16.9,7-33.3,10.5-49.2,10.5c-18.3,0-33.7-5.5-46.3-16.5C23.6,425.5,17,410.7,17,392.6
		c0-38.3,23.1-80.3,69.4-126.1c37.3-37,77.5-66.4,120.7-88.3c48.7-24.6,85.8-37,111.3-37c23.5,0,35.8,11.1,37,33.3
		c4.6-1.7,8-2.6,10.2-2.6c2.6,0,3.9,1.3,3.9,4C369.4,178.5,364.4,181.3,354.4,184.5z M332.5,192.3c-24.6,12.6-47.6,30.7-69,54.4
		c-21.4,23.7-32.1,38.9-32.1,45.7c0,3.2,1.2,4.8,3.7,4.8c10.1,0,27.7-14.6,52.7-43.8C309.4,228.1,324.3,207.8,332.5,192.3z"/>
	<path d="M297,432.2c0,3.9,4.3,5.9,12.8,5.9c1.9,0,2.9,1.2,2.9,3.6c0,2.8-4.8,4.3-14.5,4.3c-10.9,0-16.4-5.2-16.4-15.7
		c0-12.2,16.2-37.6,48.5-76.3L271,402.4c-35.1,28.7-60.5,43.1-76.3,43.1c-1.7,0-2.6-1-2.6-2.9c0-2.7,1.5-4.3,4.3-4.9
		c9.1-1.7,17.5-4.7,25-8.9c9.4-5.2,29.4-19.9,60-44l66.5-55.8c2.9-1,6.8-1.5,11.7-1.5c4.9,0,7.4,2.8,7.4,8.5
		c0,6.1-11.7,22.5-35,49.2C308.7,411.7,297,427.4,297,432.2z M393.1,281.7c-7,0-10.4-3.5-10.4-10.7c0-5.9,3.5-11.3,10.7-16.1
		c6.4-4.3,12.8-6.5,19.1-6.5c7.5,0,11.3,4.1,11.3,12.4c0,5.9-3.8,11-11.3,15.2C406,279.8,399.5,281.7,393.1,281.7z"/>
	<path d="M483.2,303.5l-78.3,3c-4.3,0-6.5-1.2-6.5-3.5c0-1.9,3.5-3.3,10.7-4.3c10-1.6,24.1-3,42.2-4.1c20.1-1.2,34.3-2.2,42.4-3.3
		l31.1-37.2c16.7-19.7,26.7-29.6,30.2-29.6c4.3,0,6.5,2.8,6.5,8.3c0,5.9-13.2,25.4-39.6,58.5c15.2-1,27.8-1.5,37.8-1.5
		c6.7,0,10,1.3,10,3.9c0,2.9-8,4.9-24.1,5.9l-33,1.1L464,361.2c-30.6,39.8-45.9,63.5-45.9,71.2c0,3.6,2.5,5.5,7.4,5.5
		c4.9,0.1,7.4,1.3,7.4,3.7c0,2.8-3.2,4.3-9.6,4.3c-12.9,0-19.4-5.2-19.4-15.7c0-8.3,4.2-20.1,12.6-35.4l18.9-31.7l-64.4,50.7
		c-26.8,21.2-47.5,31.7-62,31.7c-1.7,0-2.6-1-2.6-2.9c0-2.5,1.5-4.2,4.3-4.9c4.9-1,12.4-3.5,22.4-7.6c9.7-5.1,31.3-20.7,64.8-46.9
		c24.8-19.2,40.4-31.8,46.7-37.6C456.3,335.2,469.1,321.1,483.2,303.5z"/>
	<path d="M509.5,399.7c-38.7,30.5-65.4,45.7-80,45.7c-1.7,0-2.6-1-2.6-2.9c0-2.7,1.7-4.3,5.2-4.9c13.6-2.2,32.5-12.7,56.5-31.5
		l28-22l45-35.9c20.6-14.2,38.2-21.3,52.8-21.3c10.9,0,17,5.4,18.3,16.3c5.7-5.4,9.6-8.1,11.7-8.1c4.8,0,7.2,2,7.2,5.9
		c0,5.1-11.1,20.6-33.4,46.6c-22.3,26-33.4,41.1-33.4,45.4c0,3,2.4,4.6,7.2,4.7c4.8,0.1,7.2,1.4,7.2,3.8c0,3-4.9,4.5-14.8,4.5
		c-9.7,0-14.6-4.3-14.6-12.9c0-6.8,3.9-16.6,11.7-29.2l-27,22.9c-13.2,9.9-23.7,14.8-31.5,14.8c-12.5,0-18.7-6.3-18.7-18.9
		C504.5,415.8,506.1,408.1,509.5,399.7z M617.5,335.9c-8.6,0-26.2,12.8-53.1,38.4c-26.8,25.6-40.2,42.6-40.2,51.2
		c0,3.9,1.9,5.9,5.7,5.9c8.3,0,26-12.5,53.2-37.6c27.2-25.1,40.8-41.9,40.8-50.7C623.8,338.3,621.7,335.9,617.5,335.9z"/>
	<path d="M769.7,303.5l-78.3,3c-4.3,0-6.5-1.2-6.5-3.5c0-1.9,3.5-3.3,10.7-4.3c10-1.6,24.1-3,42.2-4.1c20.1-1.2,34.3-2.2,42.4-3.3
		l31.1-37.2c16.7-19.7,26.7-29.6,30.2-29.6c4.3,0,6.5,2.8,6.5,8.3c0,5.9-13.2,25.4-39.6,58.5c15.2-1,27.8-1.5,37.8-1.5
		c6.7,0,10,1.3,10,3.9c0,2.9-8,4.9-24.1,5.9l-33,1.1l-48.5,60.6c-30.6,39.8-45.9,63.5-45.9,71.2c0,3.6,2.5,5.5,7.4,5.5
		c4.9,0.1,7.4,1.3,7.4,3.7c0,2.8-3.2,4.3-9.6,4.3c-12.9,0-19.4-5.2-19.4-15.7c0-8.3,4.2-20.1,12.6-35.4l18.9-31.7l-64.4,50.7
		c-26.8,21.2-47.5,31.7-62,31.7c-1.7,0-2.6-1-2.6-2.9c0-2.5,1.5-4.2,4.3-4.9c4.9-1,12.4-3.5,22.4-7.6c9.7-5.1,31.3-20.7,64.8-46.9
		c24.8-19.2,40.4-31.8,46.7-37.6C742.9,335.2,755.7,321.1,769.7,303.5z"/>
	<path d="M818.4,432.2c0,3.9,4.3,5.9,12.8,5.9c1.9,0,2.9,1.2,2.9,3.6c0,2.8-4.8,4.3-14.5,4.3c-10.9,0-16.4-5.2-16.4-15.7
		c0-12.2,16.2-37.6,48.5-76.3l-59.4,48.5c-35.1,28.7-60.5,43.1-76.3,43.1c-1.7,0-2.6-1-2.6-2.9c0-2.7,1.5-4.3,4.3-4.9
		c9.1-1.7,17.5-4.7,25-8.9c9.4-5.2,29.4-19.9,60-44l66.5-55.8c2.9-1,6.8-1.5,11.7-1.5c4.9,0,7.4,2.8,7.4,8.5
		c0,6.1-11.7,22.5-35,49.2C830.1,411.7,818.4,427.4,818.4,432.2z M914.5,281.7c-7,0-10.4-3.5-10.4-10.7c0-5.9,3.6-11.3,10.7-16.1
		c6.4-4.3,12.8-6.5,19.1-6.5c7.5,0,11.3,4.1,11.3,12.4c0,5.9-3.8,11-11.3,15.2C927.4,279.8,920.9,281.7,914.5,281.7z"/>
	<path d="M926.7,387.4l-44.8,34.1c-22.9,15.9-40,23.9-51.3,23.9c-1.7,0-2.6-0.9-2.6-2.7c0-2.8,1.5-4.5,4.3-5.1
		c8.8-1.6,16.4-4.1,22.6-7.6c10.9-5.9,28.6-18.6,53.1-38l57.4-47.1c11-9.7,17.8-14.5,20.2-14.5c3.7,0,7.7,2,12.1,6.1
		c8.4-6.4,15.8-9.6,22.3-9.6c9.8,0,14.7,5.3,14.7,15.9c0,15.8-12.6,37.3-37.8,64.6c-25.7,27.5-46.4,41.3-62.2,41.3
		c-14.8,0-22.2-7.8-22.2-23.3C912.6,417.3,917.3,404.6,926.7,387.4z M979.1,360.6c-29.6,25.9-44.4,47-44.4,63.2
		c0,7,3.3,10.5,10,10.5c10.9,0,27.8-13.2,50.9-39.5c-12.2-2.9-18.3-10.7-18.3-23.5C977.4,368,978,364.4,979.1,360.6z M1000.4,387.8
		c5.4-5.1,10.7-12,16.1-20.7c5.9-10,8.9-18,8.9-24c0-5.5-2.4-8.3-7.2-8.3c-7.1,0-14.2,4.5-21.4,13.4c-7.2,9-10.8,17.1-10.8,24.3
		C986.1,380.7,990.9,385.8,1000.4,387.8z"/>
	<path d="M1132.2,379.6c39.9-33.8,67.8-50.7,83.9-50.7c10.3,0,15.4,4.9,15.4,14.6c0,8.6-11.7,24-35,46.4c-23.3,22.4-35,35.9-35,40.5
		c0,4.6,2.6,7.1,7.9,7.5c5.3,0.4,7.9,1.6,7.9,3.8c0,2.9-5.3,4.3-15.8,4.3c-12.1,0-18.2-5.4-18.2-16.1c0-9,5.8-20.4,17.4-34.2
		c5.9-7.1,16.7-18.1,32.2-32.9c11.6-11,17.4-17.7,17.4-20c0-1.9-1.3-2.8-3.9-2.8c-8.3,0-26.2,11-53.9,33.1
		c-23,18.3-40.2,33.3-51.3,45.1c-14.2,15-22.8,22.4-25.9,22.4c-2.3,0-4.4-1.1-6.3-3.4c-1.9-2.2-2.8-4.6-2.8-7.1
		c0-3.3,10-16.8,30-40.4l35.9-42.4l-55.7,45.2l-41.1,31.5c-20.9,14.2-36.9,21.3-48.1,21.3c-1.9,0-2.8-0.9-2.8-2.6
		c0-2.6,2-4.3,6.1-5.2c5.5-1,12-3.2,19.4-6.5c10.6-4.6,32.2-20.1,64.8-46.5c29.3-23.8,50.4-42,63.3-54.6c2.2-2.2,5.6-4.8,10.2-7.8
		c2.3-0.9,4.8-1.3,7.4-1.3c2.5,0,5,0.8,7.5,2.5c2.5,1.7,3.8,3.7,3.8,6C1167,331.9,1155.4,348.7,1132.2,379.6z"/>
	<path d="M1242.6,408.3c-30.1,24.8-53.1,37.2-68.7,37.2c-1.7,0-2.6-0.9-2.6-2.7c0-2.7,1.5-4.4,4.3-5.1c5.4-1.3,13.6-4.2,24.8-8.7
		c10.4-5.6,37-26.2,79.6-61.6c40.4-33.6,61.2-50.4,62.2-50.4c3.3,0,6.6,1.4,9.9,4.3c3.3,2.9,4.9,6,4.9,9.3
		c0,10.6-8.3,29.2-24.8,55.8c-14.4,23-26.9,40.2-37.6,51.7c6.4,0,9.6,1.2,9.6,3.6c0,3-3.1,4.5-9.2,4.5c-1.6,0-4-0.3-7.1-0.9
		c-3.1-0.6-5.5-0.9-7.1-0.9c-1.2,0-2.9,0.2-5.2,0.7c-2.3,0.4-4.1,0.7-5.2,0.7C1251.8,445.7,1242.6,433.2,1242.6,408.3z
		 M1270.9,434.1l-6.1-17.3c-3.2-8.5-6.3-12.7-9.3-12.7c-3.2,0-4.8,2.5-4.8,7.4c0,5,1.4,10.1,4.3,15.3c3.3,6,7.2,9,11.7,9
		C1268.5,435.9,1269.9,435.3,1270.9,434.1z M1277.2,427.4c10.1-8.4,21.3-22.9,33.5-43.6c11.3-19.2,19.2-36.1,23.7-50.8l-77.8,63.3
		c5.4,0.9,9.9,5.1,13.5,12.7L1277.2,427.4z"/>
</g>
</svg>
`,
})

var app = new Vue({
  el: '#app',
  template: `<div class="container-fluid">
  <nav-bar v-bind:lescategories="categories" v-on:pagechangee="changerpage" v-on:afficherLike="pagelikes"></nav-bar>

     <div id="content">
       <div class="row">
        <div class="col-lg-12">
          <svgcit id="mainsvg"></svgcit>
        </div>
      </div>
    <renducitlike v-if="pagecitlike === true" v-bind:citations="citlikes"></renducitlike>
    <main-citation v-else v-on:ajoutLike="tablike" v-on:recharger="rafraichi" v-bind:nomcategorie="nompage" v-bind:sdcitlikes="citlikes" :key='rcompo'></main-citation>
    </div>
    </div>
    </div>
  </div>`,
  data: function() {
    return {
      titre: 'Test',
      categories: ['Aléatoire', 'Amour', 'Bonheur', 'Argent', 'Histoire/Guerre', 'Vie/Mort', 'Travail', 'Politique'],
      nompage: 'Aléatoire',
      rcompo: 0,
      citlikes: [],
      // idlike: 0,
      pagecitlike: false
    }
  },
  mounted() {
    if (localStorage.saved) this.citlikes = JSON.parse(localStorage.saved);
  },
  watch: {
    citlikes(newCitlikes) {
      localStorage.saved = JSON.stringify(newCitlikes);
    }
  },
  methods: {
    rafraichi: function() {
      this.rcompo = this.rcompo + 1;
    },
    changerpage: function(categorie) {
      this.nompage = categorie;
      this.rcompo = this.rcompo + 1;
      this.pagecitlike = false;
    },
    tablike: function(citation, name, id) {
      // idlike = this.idlike++;
      this.citlikes.push({
        cit: citation,
        auteur: name,
        id: id
      });
      console.log(this.citlikes);
    },
    pagelikes: function() {
      this.pagecitlike = !this.pagecitlike;
    },
  }
})
