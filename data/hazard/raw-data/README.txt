This folder contains tsunami runup height vs mean-exceedance-rate information in a shapefile.

Licence
-------

Copyright Commonwealth of Australia (Geoscience Australia) and NGI 2017

This work may be used and distributed under the terms of the Creative Commons
CC-BY licence: 
    https://creativecommons.org/licenses/by/3.0/au/


Citation
--------

The outputs are from the global probabilistic tsunami hazard assessment
described in the following paper:

@Article{Davies2017,
  Title                    = {A global probabilistic tsunami hazard assessment from earthquake sources},
  Author                   = {Davies, Gareth and Griffin, Jonathan and Løvholt, Finn and Glimsdal, Sylfest and Harbitz, Carl and Thio, Hong Kie and Lorito, Stefano and Basili, Roberto and Selva, Jacopo and Geist, Eric and Baptista, Maria Ana},
  Journal                  = {Geological Society, London, Special Publications},
  Year                     = {2017},

  Month                    = {Feb},
  Pages                    = {SP456.5},

  Doi                      = {10.1144/sp456.5},
  ISSN                     = {2041-4927},
  Publisher                = {Geological Society of London},
  Url                      = {http://dx.doi.org/10.1144/SP456.5}
}

Usage and Limitations
---------------------
The above publication should be consulted for information on how the data was
derived, and associated limitations. That study emphasises that global analyses
are not recommended for use in local-scale risk assessment. 


Shapefile Attributes
--------------------

- Attributes with the title "rate_N" (i.e. rate_5, rate_10, rate_25, ...., rate_2000) give the mean exceedance rate (events/year) corresponding to a tsunami runup height of 5, 10, 25, ... 2000 **centimeters**.

- Attributes with the title "ariN" (i.e. ari10, ari50, ari100, ..., ari2500) give the tsunami runup height (meters) corresponding to events with mean exceedance rate (events/year) of 1/10, 1/50, 1/100, .... 1/2500. 
	- In all cases, the runup heights are between [0.1, 20] meters. Values of 0.1 should be interpreted as "<= 0.1", and values of 20 should be interpreted as ">= 20".

There are also a few other attributes (limited between 0.1 and 20, as above):
- ari500P gives the upper 95% credible interval limit for the 1/500 runup height (m) [see bottom panel of Figure 7 of Davies et al. (2017)]
- ari500M gives the lower 95% credible interval limit for the 1/500 runup height (m) [see top panel of Figure 7 of Davies et al. (2017)]
- ari500LL gives the 1/500 runup height (m) that would be calculated using 'sigma=0.5' [see top panel of Figure 8 in Davies et al. 2017]
- ari500LZ gives the 1/500 runup height (m) that would be calculated using 'sigma=0.0' [see bottom panel of Figure 8 in Davies et al. 2017]
 
