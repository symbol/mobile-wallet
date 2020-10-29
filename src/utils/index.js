export const getDropdownListFromObjct = 
	obj => Object
		.keys(obj)
		.map(el => ({
			value: el,
			label: obj[el]
		}));