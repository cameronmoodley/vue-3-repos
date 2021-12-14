export default {
    beforeMount(el, binding) {
        let iconClass = `fa fa-${binding.value.icon}  text-green-400 text-xl`;

        if(binding.value.right){
            iconClass += ` float-right`;
        }

        console.log(binding.modifiers);

        el.innerHTML += `<i class="${iconClass}"></i>`;
    },
}