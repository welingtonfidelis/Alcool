function getStatesBr() {
    return [
        { value: 'Acre' },
        { value: 'Alagoas' },
        { value: 'Amapá' },
        { value: 'Amazonas' },
        { value: 'Bahia' },
        { value: 'Ceará' },
        { value: 'Distrito Federal' },
        { value: 'Espírito Santo' },
        { value: 'Goiás' },
        { value: 'Maranhão' },
        { value: 'Mato Grosso' },
        { value: 'Mato Grosso do Sul' },
        { value: 'Minas Gerais' },
        { value: 'Pará' },
        { value: 'Paraíba' },
        { value: 'Paraná' },
        { value: 'Pernambuco' },
        { value: 'Piauí' },
        { value: 'Rio de Janeiro' },
        { value: 'Rio Grande do Norte' },
        { value: 'Rio Grande do Sul' },
        { value: 'Rondônia' },
        { value: 'Roraima' },
        { value: 'Santa Catarina' },
        { value: 'São Paulo' },
        { value: 'Sergipe' },
        { value: 'Tocantins ' }
    ]
}

async function findByCep(cep){
    if(cep.length == 8){
        try {
            const query = await $.get({
                url: `https://viacep.com.br/ws/${cep}/json/`, 
                crossDomain: true
            });
    
            return query;
        } catch (error) {
            console.log(error);
        }
    }
}