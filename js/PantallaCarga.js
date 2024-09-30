export class LoadScene extends Phaser.Scene 
{
    constructor() {
        super({ key: 'LoadScene' });
    }

    preload() {
        //IMAGES
       this.load.image("GameplayBackground", "/Assets/Images/GameplayBackground.png");

       // AUDIOS
       this.load.audio('backgroundMusic', ['/Assets/Audio/SendThemAllToTheTrench.mp3']); // Cambia la ruta y el nombre del archivo según sea necesario

       //VIDEOS
       this.load.video({
        key: 'intro',
        url: ['/Assets/Videos/VideoTrailer.mp4'],
        asBlob: false,
        noAudio: true
        });

       let loadingBar = this.add.graphics({
        fillStyle:{
            color: 0xffffff
        }
       })

       this.load.on("progress", (percent)=>{
            loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 50);
            console.log(percent);
       })

       this.load.on("complete", ()=>{
            this.scene.start('MenuInicial')
        })
    }
    create() {
        
    }
}