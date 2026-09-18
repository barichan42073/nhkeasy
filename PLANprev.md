/ask ok. first make a plan to only populate the daily anki package with max of
>  3 words from each article, with a total of 12 words max going into anki daily
>  vocab list.                                                                  

Here's a plan to adjust the vocabulary flow to meet your requirements for the   
daily Anki package:                                                             

Explanation of Current max_words and How It Was Exceeded                        

The max_words parameter is explicitly set to 3 in anki_pipeline.py when         
vocab_extractor.filter_vocabulary_from_markdown is called. This means that for  
vocabulary extracted specifically by vocab_extractor, each article contributes  
at most 3 words.                                                                

However, the total of 55 words observed was exceeded because                    
all_filtered_vocabulary (the list used to create the combined Anki package) is  
populated from multiple sources within the pipeline:                            

 1 Gemini's side_vocab: The analyze_article_with_gemini function in pipeline.py 
   is prompted to extract 10-15 key vocabulary items.                           
    • If config.generate_html is False, these 10-15 words are directly appended 
      to all_filtered_vocabulary in pipeline.py (see the else block in          
      _process_single_article).                                                 
    • If config.generate_html is True, it's highly probable that                
      html_pipeline.process_article_html_output (which also receives analysis   
      and all_filtered_vocabulary) also appends these 10-15 words.              
 2 vocab_extractor's output: Separately, anki_pipeline.py calls                 
   vocab_extractor.filter_vocabulary_from_markdown with max_words=3. These up to
   3 words are then also appended to all_filtered_vocabulary.                   

Since all_filtered_vocabulary accumulates words from both sources for each      
article, an article could contribute roughly 13-18 words (10-15 from Gemini + up
to 3 from vocab_extractor). For 4 articles, this easily leads to 52-72 words,   
aligning with your observation of 55 words. There is no overall cap applied to  
all_filtered_vocabulary before the combined Anki package is generated.          

Plan to Populate Daily Anki Package with Max 3 Words/Article, Total 12 Words Max

The goal is to ensure that the combined Anki package (nhkeasy_YYYYMMDD.apkg)    
contains a maximum of 3 unique words per article, with an overall total limit of
12 unique words. This requires filtering and capping the all_filtered_vocabulary
list before the combined Anki package is generated.                             

This plan focuses on modifying anki_pipeline.py and making a small adjustment to
pipeline.py to ensure all words contributing to all_filtered_vocabulary for the 
combined Anki package are tagged with their article_id for accurate per-article 
limiting.                                                                       

Plan Steps:                                                                     

 1 Modify pipeline.py (_process_single_article function):                       
    • Remove the else block that directly appends analysis.side_vocab to        
      all_filtered_vocabulary when config.generate_html is False. This will     
      prevent the unfiltered Gemini vocabulary from directly contributing to the
      all_filtered_vocabulary list that feeds the combined Anki package,        
      allowing anki_pipeline to manage this instead.                            
 2 Modify anki_pipeline.py (extract_and_generate_anki_for_article function):    
    • This function currently extracts words using vocab_extractor and extends  
      all_filtered_vocabulary. It needs to ensure that the article_id or        
      article_title is associated with each vocabulary item it adds to          
      all_filtered_vocabulary, which is crucial for later per-article filtering.
    • It also needs to explicitly transform the vocab_extractor output (which   
      uses keys like kanji, hiragana) into the word, reading, definition,       
      jlpt_level format, adding the article_id (or article_title) to each.      
    • This function will become the sole source for vocabulary items being added
      to all_filtered_vocabulary for the combined Anki deck, ensuring that only 
      words meeting the vocab_extractor criteria (and its max_words=3 limit) are
      considered for the combined package.                                      
 3 Modify anki_pipeline.py (handle_combined_anki_package function):             
    • Before the line calling anki_generator.generate_anki_package:             
       • De-duplicate and limit per-article vocabulary:                         
          • Create an intermediate data structure (e.g., a dictionary           
            grouped_vocab = {}) where keys are article_id and values are lists  
            of unique vocabulary items from that article.                       
          • Iterate through the all_filtered_vocabulary list:                   
             • For each vocabulary item, retrieve its article_id.               
             • Add the item to grouped_vocab[article_id], ensuring that         
               duplicates (based on the word field) are not added within the    
               same article's list.                                             
          • After populating grouped_vocab, create a new list,                  
            final_combined_anki_vocab.                                          
          • Iterate through the values (lists of vocab items) in grouped_vocab. 
            For each article's list, take only the first 3 vocabulary items.    
          • Extend final_combined_anki_vocab with these 3 (or fewer) words.     
       • Apply overall 12-word limit:                                           
          • Cap final_combined_anki_vocab to a maximum of 12 words. If the list 
            contains more than 12 entries, truncate it to the first 12.         
       • Pass this final_combined_anki_vocab to                                 
         anki_generator.generate_anki_package.                                  

This plan ensures that the limits are strictly enforced for the combined Anki   
package while maintaining the current functionality for individual article Anki 
packages (if they are generated) and other pipeline outputs like HTML.  
