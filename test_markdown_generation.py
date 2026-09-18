# test_markdown_generation.py                                                                                                       
import argparse                                                                                                                     
import json                                                                                                                         
import logging                                                                                                                      
import sys                                                                                                                          
from pathlib import Path                                                                                                            
                                                                                                                                    
# Add the parent directory of nhkeasier_to_epub.py to sys.path if it's not already                                                  
# This assumes test_markdown_generation.py is in the same directory as nhkeasier_to_epub.py                                         
current_dir = Path(__file__).parent                                                                                                 
if str(current_dir) not in sys.path:                                                                                                
    sys.path.insert(0, str(current_dir))                                                                                            
                                                                                                                                    
from article_schema import ArticleAnalysis                                                                                          
from nhkeasier_to_epub import _generate_markdown_from_article_analysis                                                              
                                                                                                                                    
logger = logging.getLogger(__name__)                                                                                                
                                                                                                                                    
def main():                                                                                                                         
    logging.basicConfig(                                                                                                            
        level=logging.INFO,                                                                                                         
        format="%(asctime)s - %(levelname)s - %(message)s",                                                                         
        handlers=[logging.StreamHandler(sys.stdout)],                                                                               
    )                                                                                                                               
                                                                                                                                    
    parser = argparse.ArgumentParser(                                                                                               
        description="Generate Markdown from a saved ArticleAnalysis JSON object."                                                   
    )                                                                                                                               
    parser.add_argument(                                                                                                            
        "input_json",                                                                                                               
        type=Path,                                                                                                                  
        help="Path to the input ArticleAnalysis JSON file.",                                                                        
    )                                                                                                                               
    parser.add_argument(                                                                                                            
        "output_md",                                                                                                                
        type=Path,                                                                                                                  
        help="Path for the output Markdown file.",                                                                                  
    )                                                                                                                               
    args = parser.parse_args()                                                                                                      
                                                                                                                                    
    if not args.input_json.is_file():                                                                                               
        logger.error(f"Error: Input JSON file not found at '{args.input_json}'")                                                    
        sys.exit(1)                                                                                                                 
                                                                                                                                    
    try:                                                                                                                            
        logger.info(f"Loading ArticleAnalysis from {args.input_json}...")                                                           
        json_content = args.input_json.read_text(encoding="utf-8")                                                                  
        analysis = ArticleAnalysis.model_validate_json(json_content)                                                                
        logger.info("ArticleAnalysis loaded successfully.")                                                                         
                                                                                                                                    
        logger.info("Generating Markdown from ArticleAnalysis object...")                                                           
        markdown_content = _generate_markdown_from_article_analysis(analysis)                                                       
        logger.info("Markdown generated.")                                                                                          
                                                                                                                                    
        args.output_md.write_text(markdown_content, encoding="utf-8")                                                               
        logger.info(f"Generated Markdown saved to {args.output_md}")                                                                
                                                                                                                                    
    except json.JSONDecodeError as e:                                                                                               
        logger.error(f"Error decoding JSON from '{args.input_json}': {e}")                                                          
        sys.exit(1)                                                                                                                 
    except Exception as e:                                                                                                          
        logger.exception(f"An unexpected error occurred: {e}")                                                                      
        sys.exit(1)                                                                                                                 
                                                                                                                                    
if __name__ == "__main__":                                                                                                          
    main()        
