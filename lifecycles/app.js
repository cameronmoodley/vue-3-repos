let vm = Vue.createApp({
	data() {
		return {
			message: 'Hello world!',
		};
	},
	beforeCreate() {
		console.log('before Created', this.message);
	},
	created() {
		console.log('Created', this.message);
	},
	beforeMount() {
		console.log('before Mount', this.$el);
	},
	mounted() {
		console.log('Mounted', this.$el);
	},
}).mount('#app');
