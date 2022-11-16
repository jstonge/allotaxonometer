# ALLotaxonometry for all: Open-source intuitive interactive implementation of the allotaxonometer for widespread public use

The primary purpose of the alloxonometer in general is to calculate and visualize the difference between any two Zipfian ranked lists of components. This package provides the utilities to facilitate the creationg of the allotaxonometer in `d3.js`

## Babynames data

The original babyname dataset for boys and girls can be found on the [catalog.data.gov](https://catalog.data.gov/dataset?tags=baby-names) website. We keep the version used in the `observable` version in `data/`. The original dataset includes each year from 1880–2018, which have 5 or more applications.

## Twitter data

We access the Twitter data from the Comptuational Story Lab [storywrangling](https://gitlab.com/compstorylab/storywrangling)' API. Unfortunately, the API only work when you are connected on the University of Vermont's VPN. Follow the instructions [here](https://www.uvm.edu/it/kb/article/install-cisco-vpn/) to get the VPN working. Once this is done, run the following lines from the command line:

```shell
git clone https://gitlab.com/compstorylab/storywrangling.git
cd storywrangling
pip install -e .
```

Then from `python` you can get the top ngram count with rank data for any given day with the following:

```python
from storywrangling import Storywrangler
from datetime import datetime
import json
from pathlib import Path

def get_ngram(yr, month, day, fname=False):
    storywrangler = Storywrangler()
    ngram_zipf = storywrangler.get_zipf_dist(
        date=datetime(yr, month, day),
        lang="en", ngrams="1grams",
        max_rank=10000, rt=False
    ).reset_index()\
     .rename(columns={
        "ngram":"types", "count":"counts", "count_no_rt":"counts_no_rt",
        "rank":"rank", "rank_no_rt":"rank_no_rt", "freq":"probs", "freq_no_rt":"probs_no_rt"
        })\
     .dropna()\
     .assign(totalunique = lambda x: x.shape[0])\
     .loc[:, ["types", "counts", "totalunique", "probs"]]\
     .to_dict(orient="index")

    ngram_zipf = { f"{yr}_{month}_{day}": [_ for _ in ngram_zipf.values()] }

    if fname:
        if Path(fname).exists():
            with open(fname) as f:
                old_dat = json.load(f)
            
            ngram_zipf.update(old_dat)

        with open(fname, 'w') as f:
            json.dump(ngram_zipf, f)
    else:
       return ngram_zipf
```

Note that this solution is a bit clunky. At some point we would prefer to have a sql DB that we can interact with. 

## Species Abundance Data

We access the species abundance data from https://datadryad.org/stash/dataset/doi:10.15146/5xcp-0d46, downloading the full dataset, unzipping it, and then loading bci.tree\<i\>.rdata for i in (1-8), as well as bci.spptable.rdata. We then run the following code to subset the full census represented by each of the bci.tree\<i\>.rdata to get the counts of the species of the trees alive during that census, combine merge that with the species name database to get the full name, and then put it in the format that our allotaxonometer code expects:

```r    
library(Sys)
library(dplyr)
library("rlist")
library(jsonlite)

tree_data <- vector("list", length=8)



dfs = list(bci.tree1, bci.tree2, bci.tree3, bci.tree4,  bci.tree5, bci.tree6, bci.tree7, bci.tree8)


for (i in seq_along(dfs)) {
  print(i)
  full_census <- merge(dfs[[i]], bci.spptable, by='sp') 
  alive_census <-full_census[full_census$status %in% c('A','AD'),] # A='Alive', AD='A seldom-used code, applied when a tree was noted as dead in one census but was found alive in a later census. For most purposes, this code should be interpreted the same as code A for alive.'
  count_df <- dplyr::count(alive_census, Latin, sort = TRUE)
  names(count_df)[names(count_df) == 'Latin'] <- 'types'
  names(count_df)[names(count_df) == 'n'] <- 'counts'
  count_df['totalunique'] <- nrow(count_df)
  count_df['probs']<-count_df['counts'] / nrow(alive_census)
  tree_data[[i]] <- count_df
}

names(tree_data) <- c("1981-1983", "1985", "1991-1992", "1995-1996", "2000-2001", "2005-2006", "2010-2011", "2013-2015")

exportJson <- toJSON(tree_data)
write(exportJson, "tree_species_counts.json")
```
