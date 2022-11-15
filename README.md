# ALLotaxonometry for all: Open-source intuitive interactive implementation of the allotaxonometer for widespread public use

The primary purpose of the alloxonometer in general is to calculate and visualize the difference between any two Zipfian ranked lists of components. This package provides the utilities to facilitate the creationg of the allotaxonometer in `d3.js`

## Babynames data



## Twitter data

We access the Twitter data from the Comptuational Story Lab [storywrangling](https://gitlab.com/compstorylab/storywrangling)' API. Unfortunately, the API only work when you are connected on the University of Vermont's VPN. Follow the instructions [here](https://www.uvm.edu/it/kb/article/install-cisco-vpn/ to get the VPN working. Once this is done, run the following lines from the command line:

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

storywrangler = Storywrangler()

def get_ngram(yr, month, day, fname=False):
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
     .loc[:, ["types", "counts", "probs"]]\
     .to_dict(orient='index')

    ngram_zipf = { f"{yr}_{month}_{day}": ngram_zipf }

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
