const directive = {
	daterange: {
		bind: (el, binding, vnode) => {
			console.log(el);
			console.log(binding);
			console.log(vnode);
			el.addEventListener('input', ()=>{
				console.log(123123);
			})
		}
	}
}

export default directive;
