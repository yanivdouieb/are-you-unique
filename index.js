const app = require('express')();
const port = process.env.PORT || 3000;
const editJsonFile = require('edit-json-file');

app.set('view engine', 'ejs');
app.set('views', './');

app.get('/', (req, res) => {
    res.render('index');
});
app.get('/api/array', (req, res) => {
    const file = editJsonFile('./array.json');
    const now = file.get(req.headers.array)
    if(!now){
        res.send({
            status: 'succes',
            message: 'array not found'
        });
        file.set(req.headers.array, 1);
        file.save()
        const file2 = editJsonFile('./data.json');
        const chanceNow = file2.get("chance")
        if(chanceNow){
            file2.set("chance", chanceNow - 1);
        }else{
            file2.set("chance", 59049 - 1);
        }
        file2.save()
    }else{
        res.send({
            status: 'succes',
            message: 'array found',
            data: now
        });
        file.set(req.headers.array, now + 1);
        file.save()
    }
})
app.get('/api/chanceNow', (req, res) => {
    if(!require('./data.json').chance){
        res.send({
            status: 'succes',
            data: 59049
        })
    }else{
        res.send({
            status: 'succes',
            data: require('./data.json').chance
        })
    }
})
app.get('*', (req, res) => {
    res.redirect('/')
})
setInterval(()=>{
    const chance = require('./data.json').chance
    if(chance === 0){
        const file = editJsonFile('./data.json');
        file.set("chance", 59049);
        file.save()
    }else{}
}, 100)
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})