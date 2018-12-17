import dayjs from 'dayjs'

const filter = {
	date:(value,format='YYYY-MM-DD')=>{
		if(value){
			return dayjs(value?value:'').format(format);
		}else{
			return '';
		}
	},
	fen2yuan:(value)=>{
		return (value*0.01).toFixed(2)
	},
	yuan2fen:(value)=>{
		return value*100
	},
	dayjs:(value)=>{
		return dayjs(value?value:'');
	},
	KB2MB:(value)=>{
		if(!url){
			return '0MB';
		}else{
			return `${(value/1024).toFixed(2)}`;
		}
	},
	f2y:(value)=>{
		if(!value){
			return 0;
		}else{
			return `${(value * 0.01).toFixed(2)}`;
		}
	},
	branchLayout:(value,layout)=>{
		if(!value){
			return '';
		}else{
			if(layout=='html'){
				return `${value.name?value.name:''}&nbsp;&nbsp;&nbsp;&nbsp;${value.province?value.province:''}${value.city?value.city:''}${value.area?value.area:''}${value.address?value.address:''}&nbsp;&nbsp;&nbsp;&nbsp;${value.contactName?value.contactName:''}&nbsp;&nbsp;&nbsp;&nbsp;${value.contactTel?value.contactTel:''}`
			}else{
				return `${value.name?value.name:''}  ${value.province?value.province:''}${value.city?value.city:''}${value.area?value.area:''}${value.address?value.address:''}  ${value.contactName?value.contactName:''}  ${value.contactTel?value.contactTel:''}`
			}

		}
	},
	addressLayout:(value,layout)=>{
		if(!value){
			return '';
		}else{
			if(layout=='html'){
				return `${value.contactName?value.contactName:''}&nbsp;&nbsp;&nbsp;&nbsp;
				${value.province?value.province:''}
				${value.city?value.city:''}
				${value.area?value.area:''}
				${value.address?value.address:''}&nbsp;&nbsp;&nbsp;&nbsp;
				${value.contactTel?value.contactTel:''}`
			}else{
				return `${value.contactName?value.contactName:''}  ${value.province?value.province:''}${value.city?value.city:''}${value.area?value.area:''}${value.address?value.address:''}  ${value.contactTel?value.contactTel:''}`
			}

		}
	}

}

export default filter;
