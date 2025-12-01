const express=require('express');
const router=express.Router();
const Translation=require('../models/Translation');
const { set } = require('mongoose');
const { mockTranslate } = require('../utils/translator');


router.post('/',async(req,res)=>{
  const {key,values}=req.body;
  if(!key || !values || !values.en){
    return res.status(400).json({msg:"Key and English value (values.en) required"})
  };

  try {
    const t=new Translation({key,values});
    await t.save();
    return res.status(201).json(t)
  } catch (error) {
    console.error('Error creating translation: ',error);
    if(error.code===11000){
      return res.status(400).json({msg:"Translation key already exists"})
    };

    return res.status(500).json({msg:"server error"})
  }
});


router.get('/', async (req, res) => {
  const q = req.query.q;
  try {
    let filter = {};
    if (q) {
      const regex = new RegExp(q, 'i');
      filter = { key: regex };
    }

    let results = await Translation.find(filter).sort({ updatedAt: -1 }).limit(500);

    if (q) {
      const regex = new RegExp(q, 'i');
      results = results.filter((doc) => {
        if (regex.test(doc.key)) return true;
        for (const [, value] of doc.values) {
          if (regex.test(value)) return true;
        }
        return false;
      });
    }

    return res.json(results);
  } catch (err) {
    console.error('Error fetching translations:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});


router.get('/:id',async (req,res)=>{
  try {
    const t= await Translation.findById(req.params.id);
    if(!t) return res.status(404).json({msg:"not found"});
    return res.json(t)
  } catch (error) {
    console.error('error getting translations', error);
    return res.status(500).json({msg:"server error"})
  }
});

router.put('/:id',async(req,res)=>{
  try {
    const {values}=req.body;
    if(!values) return res.status(400).json({msg:"values required"});

    const t=await Translation.findById(req.params.id);
    if(!t) return res.status(404).json({msg:"not found"});
 
    for(const [lang,text] of Object.entries(values)){
      t.values.set(lang,text)
    };

    await t.save();
    return res.json(t)
  } catch (error) {
    console.error('Error updating translatiosn', error);
    return res.status(500).json({msg:"server error"})
  }
});

router.delete('/:id',async (req,res)=>{
  try {
    const deleted = await Translation.findByIdAndDelete(req.params.id);
     if (!deleted) return res.status(404).json({ msg: 'Not found' });
     return res.json({msg:"deleted"})
  } catch (error) {
    console.error("error deleting translation", error);
    return res.status(500).json({msg:"serve error"})
  }
});

router.post('/autogen', async (req, res) => {
  const { key, en, langs } = req.body;

  if (!key || !en) {
    return res.status(400).json({ msg: 'key and en (English text) required' });
  }

  try {
    const values = { en };
    const targetLangs = Array.isArray(langs) && langs.length ? langs : ['hi', 'bn'];

    targetLangs.forEach((lang) => {
      values[lang] = mockTranslate(en, lang);
    });

    const t = new Translation({ key, values });
    await t.save();

    return res.status(201).json(t);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'Translation key already exists' });
    }
    return res.status(500).json({ msg: 'Server error' });
  }
});

module.exports=router
