import pandas as pd

# 1. Load both files
df1 = pd.read_csv('imkanji_1_to_9.csv')
df2 = pd.read_csv('dummy_exported_cleaned.csv')

# 2. Merge into a single master dataset
merged_df = pd.concat([df1, df2], ignore_index=True)

# 3. Sort by Chapter Number to keep ordering clean
merged_df = merged_df.sort_values(by=['Chapter Number']).reset_index(drop=True)

# 4. Standardize JLPT Levels
# Strategy: Map each unique Target Kanji to its primary (most frequent) JLPT level
kanji_to_jlpt = merged_df.groupby('Target Kanji')['JLPT Level'].agg(
    lambda x: x.mode()[0]
)
merged_df['JLPT Level'] = merged_df['Target Kanji'].map(kanji_to_jlpt)

# 5. Save to a clean master file
merged_df.to_csv('master_imkanji_1_to_9.csv', index=False)
print("Files merged and JLPT levels standardized successfully!")
