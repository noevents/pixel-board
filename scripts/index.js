let startTime
window.onload = function timer(){
  startTime = Math.floor(Date.now() / 1000);
  runTimer()
}
function runTimer() {
  let now = Math.floor(Date.now() / 1000)
  let diff = now - startTime
  let h = Math.floor(diff / 3600)
  let m = Math.floor(diff / 60)
  let s = Math.floor(diff % 60)
  document.getElementById("timer").innerHTML = `${timeDigits(h)}:${timeDigits(m)}:${timeDigits(s)}`
  let t = setTimeout(runTimer, 500)
}
function timeDigits(num){
  return num<10 ? `0${num}` : num
}
class PixelBoard{
  constructor(id){
    this.id = id
    this.statsSown = false;
    this.stats = document.createElement('div')
    this.statsPanel = document.getElementById('stats')
    this.canvas = document.createElement('canvas')
    this.canvasSize = 200
    this.counter = document.createElement('p')
    this.degrees = ['rotated0', 'rotated90', 'rotated180', 'rotated270']
    this.rotatePos = 0
  }
  render(size){
    this.filled = []
    this.size = size
    this.boardWrapper = document.createElement('div');
    this.board = document.createElement('table'); 
    this.boardWrapper.id = this.id
    this.boardWrapper.classList = 'board-wrapper'
    this.board.classList = 'rotated0'
    this.board.style.border = '0'
    let counter = 0
    for(let i=0; i<this.size; i++){
      let tr = this.board.appendChild(document.createElement('tr'));
      for(let k=0; k<this.size; k++){
        let pixel = document.createElement('td')
        pixel.id = `${counter++}`
        pixel.addEventListener('click', (e)=>{
          e.target.classList.toggle('filled')
          this.filled[e.target.id] = (!this.filled[e.target.id])?true:false
        })
        tr.appendChild(pixel);
      }
    }
    this.boardWrapper.appendChild(this.board)
    return this.boardWrapper
  }
  rotateBtn(){
    let btn = document.createElement('button');
    btn.id = 'rotate'
    btn.innerHTML = 'rotate'
    btn.addEventListener('click', (e)=>{
      for(let i=0; i<this.degrees.length; i++){
        if(this.board.classList.contains(this.degrees[i])){
          this.board.classList.toggle(this.degrees[i])
          this.board.classList.toggle(this.degrees[(i+1)%4])
          this.rotatePos = (i+1)%4
          break
        }
      }
    })
    return btn
  }
  renderCanvas(ctx){
    let step = this.canvasSize/this.size
    let counter = 0
    for(let x=0; x< this.canvasSize; x+=step){
      for(let y=0; y< this.canvasSize; y+=step){
        ctx.fillStyle = (this.filled[counter++])?'#000':'#A2B2BF'
        ctx.fillRect(y, x, step, step)
      }
    }
  }
  renderStats(){
    this.statsPanel.style.height = '245px'
    this.stats.id = 'stats-panel'
    this.canvas.id = 'canvas'
    this.canvas.classList = this.degrees[this.rotatePos]
    this.canvas.setAttribute('height',`${this.canvasSize}px`)
    this.canvas.setAttribute('width', `${this.canvasSize}px`)
    let ctx = this.canvas.getContext("2d");
    this.renderCanvas(ctx)
    this.counter.innerHTML = `Количество пикселей: ${document.getElementsByClassName('filled').length}
Время: ${document.getElementById('timer').innerHTML}`
    this.stats.appendChild(this.canvas)
    this.stats.appendChild(this.counter)
    this.statsPanel.appendChild(this.stats)
    this.statsSown = true
  }
  hideStats(){
    this.statsPanel.removeChild(this.stats)
    this.stats.removeChild(this.canvas)
    this.stats.removeChild(this.counter)
    this.statsPanel.style.height = '18px'
    this.statsSown = false
  }
  statsBtn(){
    let btn = document.createElement('button');
    btn.id = 'show-stats'
    btn.innerHTML = 'stats'
    btn.addEventListener('click', (e)=>{
      this.statsSown ? this.hideStats() : this.renderStats()
    })
    return btn
  }
}
let footer = document.getElementsByClassName("footer")[0]
let btns = document.getElementsByClassName("buttons")[0]
let main = document.getElementsByClassName("main")[0]
const drawBoard = new PixelBoard('board1')
let form = document.forms['settings']
main.appendChild(drawBoard.render(10)) 
form.onsubmit = function(e){
  e.preventDefault()
  main.removeChild(document.getElementById('board1'))
  main.appendChild(drawBoard.render(form.size.value > 50?50:form.size.value)) 
}

btns.appendChild(drawBoard.rotateBtn())
btns.appendChild(drawBoard.statsBtn())