const mongoose =require('mongoose')

const Schema = mongoose.Schema

const HeroSectionSchema = Schema({
     title: {type: String, required: true, unique: true}, ///
     subHead: {type: String}, ///
     type: {type: String, required: true}, //movies/tvshow
     image: {type: String, required: true}, //
     heroImage: {type: String,}, //
     genres: {type: Array, required: true}, //
     OTT: {type: Array, required: true}, //
     language: {type: String, required: true}, ///
     trending: {type: Boolean, required: true}, //yes/no
     hero: {type: Boolean, required: true}, //yes/no
     duration: {type: String}, ///
     ratings: { ///
        direction: {type: Number},
        music: {type: Number},
        story: {type: Number},
        dialogue: {type: Number},
        performance: {type: Number}
     },
     review: {type: String}, ///
     spoiler: {type: String}, ///
     seenWithParents: {type: String}, ///
     TIItake: {type: String}, ///
     emoji: {type: Array}, //dropdown
   //   whereToWatch: {type: Schema.Types.Mixed},
     trailer: {type: String}, ///
     createdBy: {type: String},
     createdAt: {type: Date, default: Date.now}
})

const HeroSectionModel = mongoose.model('heroSection', HeroSectionSchema)

module.exports = HeroSectionModel