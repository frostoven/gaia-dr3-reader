Introduction
------------

_This spec taken from what can be found in the GAIA DR3 CSVs, reformatted and
slightly modified by Frostoven to hopefully be more legible. Includes a few
typo corrections._

* Delimiter: `,`
* Release: Gaia DR3
* Table: `gaia_source`
* Description: This table has an entry for every Gaia observed source as
  published with this data release. It contains the basic source parameters, in
  their final state as processed by the Gaia Data Processing and Analysis
  Consortium from the raw data coming from the spacecraft. The table is
  complemented with others containing information specific to certain kinds of
  objects (e.g. ~Solar-system objects, non-single stars, variables etc.) and
  value-added processing (e.g. ~astrophysical parameters etc.). Further array
  data types (spectra, epoch measurements) are presented separately via
  'Datalink' resources.
* Citation: How to cite and acknowledge Gaia:
  https://gea.esac.esa.int/archive/documentation/credits.html
* Known issues: https://www.cosmos.esa.int/web/gaia-users/known-issues
* Documentation: Tutorials and documentation:
  https://www.cosmos.esa.int/web/gaia-users/archive

All columns
-----------

_Technical note: boolean values and strings are both stored in double quotes
unless null. Some strings may be set to values such as "NOT_AVAILABLE" instead
of null when information is missing._

Structure: column_name [type|unit_if_any] - description, ucd.

* `solution_id` `[int64]` - Solution Identifier
    * `ucd: meta.version`

* `designation` `[string]` - Unique source designation (unique across all Data Releases)
    * `ucd: meta.id;meta.main`

* `source_id` `[int64]` - Unique source identifier (unique within a particular Data Release)
    * `ucd: meta.id`

* `random_index` `[int64]` - Random index for use when selecting subsets
    * `ucd: meta.code`

* `ref_epoch` `[float64|yr]` - Reference epoch
    * `ucd: meta.ref;time.epoch`

* `ra` `[float64|deg]` - Right ascension
    * `ucd: pos.eq.ra;meta.main`

* `ra_error` `[float32|mas]` - Standard error of right ascension
    * `ucd: stat.error;pos.eq.ra`

* `dec` `[float64|deg]` - Declination
    * `ucd: pos.eq.dec;meta.main`

* `dec_error` `[float32|mas]` - Standard error of declination
    * `ucd: stat.error;pos.eq.dec`

* `parallax` `[float64|mas]` - Parallax
    * `ucd: pos.parallax.trig`

* `parallax_error` `[float32|mas]` - Standard error of parallax
    * `ucd: stat.error;pos.parallax.trig`

* `parallax_over_error` `[float32]` - Parallax divided by its standard error
    * `ucd: stat.snr;pos.parallax.trig`

* `pm` `[float32|mas.yr**-1]` - Total proper motion
    * `ucd: pos.pm;pos.eq`

* `pmra` `[float64|mas.yr**-1]` - Proper motion in right ascension direction
    * `ucd: pos.pm;pos.eq.ra`

* `pmra_error` `[float32|mas.yr**-1]` - Standard error of proper motion in right ascension direction
    * `ucd: stat.error;pos.pm;pos.eq.ra`

* `pmdec` `[float64|mas.yr**-1]` - Proper motion in declination direction
    * `ucd: pos.pm;pos.eq.dec`

* `pmdec_error` `[float32|mas.yr**-1]` - Standard error of proper motion in declination direction
    * `ucd: stat.error;pos.pm;pos.eq.dec`

* `ra_dec_corr` `[float32]` - Correlation between right ascension and declination
    * `ucd: stat.correlation`

* `ra_parallax_corr` `[float32]` - Correlation between right ascension and parallax
    * `ucd: stat.correlation`

* `ra_pmra_corr` `[float32]` - Correlation between right ascension and proper motion in right ascension
    * `ucd: stat.correlation`

* `ra_pmdec_corr` `[float32]` - Correlation between right ascension and proper motion in declination
    * `ucd: stat.correlation`

* `dec_parallax_corr` `[float32]` - Correlation between declination and parallax
    * `ucd: stat.correlation`

* `dec_pmra_corr` `[float32]` - Correlation between declination and proper motion in right ascension
    * `ucd: stat.correlation`

* `dec_pmdec_corr` `[float32]` - Correlation between declination and proper motion in declination
    * `ucd: stat.correlation`

* `parallax_pmra_corr` `[float32]` - Correlation between parallax and proper motion in right ascension
    * `ucd: stat.correlation`

* `parallax_pmdec_corr` `[float32]` - Correlation between parallax and proper motion in declination
    * `ucd: stat.correlation`

* `pmra_pmdec_corr` `[float32]` - Correlation between proper motion in right ascension and proper motion in declination
    * `ucd: stat.correlation`

* `astrometric_n_obs_al` `[int16]` - Total number of observations in the along-scan (AL) direction
    * `ucd: meta.number`

* `astrometric_n_obs_ac` `[int16]` - Total number of observations in the across-scan (AC) direction
    * `ucd: meta.number`

* `astrometric_n_good_obs_al` `[int16]` - Number of good observations in the along-scan (AL) direction
    * `ucd: meta.number`

* `astrometric_n_bad_obs_al` `[int16]` - Number of bad observations in the along-scan (AL) direction
    * `ucd: meta.number`

* `astrometric_gof_al` `[float32]` - Goodness of fit statistic of model wrt along-scan observations
    * `ucd: stat.fit.goodness`

* `astrometric_chi2_al` `[float32]` - AL chi-square value
    * `ucd: stat.fit.chi2`

* `astrometric_excess_noise` `[float32|mas]` - Excess noise of the source
    * `ucd: stat.value`

* `astrometric_excess_noise_sig` `[float32]` - Significance of excess noise
    * `ucd: stat.value`

* `astrometric_params_solved` `[int8]` - Which parameters have been solved for?
    * `ucd: meta.number`

* `astrometric_primary_flag` `[bool]` - Primary or secondary
    * `ucd: meta.code`

* `nu_eff_used_in_astrometry` `[float32|um**-1]` - Effective wavenumber of the source used in the astrometric solution
    * `ucd: em.wavenumber`

* `pseudocolour` `[float32|um**-1]` - Astrometrically estimated pseudocolour of the source
    * `ucd: em.wavenumber`

* `pseudocolour_error` `[float32|um**-1]` - Standard error of the pseudocolour of the source
    * `ucd: stat.error;em.wavenumber`

* `ra_pseudocolour_corr` `[float32]` - Correlation between right ascension and pseudocolour
    * `ucd: stat.correlation;em.wavenumber;pos.eq.ra`

* `dec_pseudocolour_corr` `[float32]` - Correlation between declination and pseudocolour
    * `ucd: stat.correlation;em.wavenumber;pos.eq.dec`

* `parallax_pseudocolour_corr` `[float32]` - Correlation between parallax and pseudocolour
    * `ucd: stat.correlation;em.wavenumber;pos.parallax`

* `pmra_pseudocolour_corr` `[float32]` - Correlation between proper motion in right ascension and pseudocolour
    * `ucd: stat.correlation;em.wavenumber;pos.pm;pos.eq.ra`

* `pmdec_pseudocolour_corr` `[float32]` - Correlation between proper motion in declination and pseudocolour
    * `ucd: stat.correlation;em.wavenumber;pos.pm;pos.eq.dec`

* `astrometric_matched_transits` `[int16]` - Matched FOV transits used in the AGIS solution
    * `ucd: meta.number`

* `visibility_periods_used` `[int16]` - Number of visibility periods used in Astrometric solution
    * `ucd: meta.number`

* `astrometric_sigma5d_max` `[float32|mas]` - The longest semi-major axis of the 5-d error ellipsoid
    * `ucd: stat;pos.errorEllipse`

* `matched_transits` `[int16]` - The number of transits matched to this source
    * `ucd: meta.number`

* `new_matched_transits` `[int16]` - The number of transits newly incorporated into an existing source in the current cycle
    * `ucd: meta.number`

* `matched_transits_removed` `[int16]` - The number of transits removed from an existing source in the current cycle
    * `ucd: meta.number`

* `ipd_gof_harmonic_amplitude` `[float32]` - Amplitude of the IPD GoF versus position angle of scan
    * `ucd: stat.value`

* `ipd_gof_harmonic_phase` `[float32|deg]` - Phase of the IPD GoF versus position angle of scan
    * `ucd: pos.posAng;stat.value`

* `ipd_frac_multi_peak` `[int8]` - Percent of successful-IPD windows with more than one peak
    * `ucd: stat.value`

* `ipd_frac_odd_win` `[int8]` - Percent of transits with truncated windows or multiple gate
    * `ucd: stat.value`

* `ruwe` `[float32]` - Renormalised unit weight error
    * `ucd: stat.error`

* `scan_direction_strength_k1` `[float32]` - Degree of concentration of scan directions across the source
    * `ucd: stat.value`

* `scan_direction_strength_k2` `[float32]` - Degree of concentration of scan directions across the source
    * `ucd: stat.value`

* `scan_direction_strength_k3` `[float32]` - Degree of concentration of scan directions across the source
    * `ucd: stat.value`

* `scan_direction_strength_k4` `[float32]` - Degree of concentration of scan directions across the source
    * `ucd: stat.value`

* `scan_direction_mean_k1` `[float32|deg]` - Mean position angle of scan directions across the source
    * `ucd: pos.posAng;stat.mean`

* `scan_direction_mean_k2` `[float32|deg]` - Mean position angle of scan directions across the source
    * `ucd: pos.posAng;stat.mean`

* `scan_direction_mean_k3` `[float32|deg]` - Mean position angle of scan directions across the source
    * `ucd: pos.posAng;stat.mean`

* `scan_direction_mean_k4` `[float32]` - Mean position angle of scan directions across the source
    * `ucd: pos.posAng;stat.mean`

* `duplicated_source` `[bool]` - Source with multiple source identifiers
    * `ucd: meta.code.status`

* `phot_g_n_obs` `[int16]` - Number of observations contributing to G photometry
    * `ucd: meta.number`

* `phot_g_mean_flux` `[float64|'electron'.s**-1]` - G-band mean flux
    * `ucd: phot.flux;em.opt`

* `phot_g_mean_flux_error` `[float32|'electron'.s**-1]` - Error on G-band mean flux
    * `ucd: stat.error;phot.flux;em.opt`

* `phot_g_mean_flux_over_error` `[float32]` - G-band mean flux divided by its error
    * `ucd: stat.snr;phot.flux;em.opt`

* `phot_g_mean_mag` `[float32|mag]` - G-band mean magnitude
    * `ucd: phot.mag;em.opt`

* `phot_bp_n_obs` `[int16]` - Number of observations contributing to BP photometry
    * `ucd: meta.number`

* `phot_bp_mean_flux` `[float64|'electron'.s**-1]` - Integrated BP mean flux
    * `ucd: phot.flux;em.opt.B`

* `phot_bp_mean_flux_error` `[float32|'electron'.s**-1]` - Error on the integrated BP mean flux
    * `ucd: stat.error;phot.flux;em.opt.B`

* `phot_bp_mean_flux_over_error` `[float32]` - Integrated BP mean flux divided by its error
    * `ucd: stat.snr;phot.flux;em.opt.B`

* `phot_bp_mean_mag` `[float32|mag]` - Integrated BP mean magnitude
    * `ucd: phot.mag;em.opt.B`

* `phot_rp_n_obs` `[int16]` - Number of observations contributing to RP photometry
    * `ucd: meta.number`

* `phot_rp_mean_flux` `[float64|'electron'.s**-1]` - Integrated RP mean flux
    * `ucd: phot.flux;em.opt.R`

* `phot_rp_mean_flux_error` `[float32|'electron'.s**-1]` - Error on the integrated RP mean flux
    * `ucd: stat.error;phot.flux;em.opt.R`

* `phot_rp_mean_flux_over_error` `[float32]` - Integrated RP mean flux divided by its error
    * `ucd: stat.snr;phot.flux;em.opt.R`

* `phot_rp_mean_mag` `[float32|mag]` - Integrated RP mean magnitude
    * `ucd: phot.mag;em.opt.R`

* `phot_bp_rp_excess_factor` `[float32]` - BP/RP excess factor
    * `ucd: arith.factor;phot.flux;em.opt`

* `phot_bp_n_contaminated_transits` `[int16]` - Number of BP contaminated transits
    * `ucd: meta.number`

* `phot_bp_n_blended_transits` `[int16]` - Number of BP blended transits
    * `ucd: meta.number`

* `phot_rp_n_contaminated_transits` `[int16]` - Number of RP contaminated transits
    * `ucd: meta.number`

* `phot_rp_n_blended_transits` `[int16]` - Number of RP blended transits
    * `ucd: meta.number`

* `phot_proc_mode` `[int8]` - Photometry processing mode
    * `ucd: meta.code`

* `bp_rp` `[float32]` - BP - RP colour
    * `ucd: phot.color;em.opt.B;em.opt.R`

* `bp_g` `[float32|mag]` - BP - G colour
    * `ucd: phot.color;em.opt.B;em.opt`

* `g_rp` `[float32|mag]` - G - RP colour
    * `ucd: phot.color;em.opt;em.opt.R`

* `radial_velocity` `[float32|km.s**-1]` - Radial velocity
    * `ucd: spect.dopplerVeloc.opt;em.opt.I`

* `radial_velocity_error` `[float32|km.s**-1]` - Radial velocity error
    * `ucd: stat.error;spect.dopplerVeloc.opt;em.opt.I`

* `rv_method_used` `[int8]` - Method used to obtain the radial velocity
    * `ucd: meta.code.class`

* `rv_nb_transits` `[int16]` - Number of transits used to compute the radial velocity
    * `ucd: meta.number`

* `rv_nb_deblended_transits` `[int16]` - Number of valid transits that have undergone deblending
    * `ucd: meta.number`

* `rv_visibility_periods_used` `[int16]` - Number of visibility periods used to estimate the radial velocity
    * `ucd: meta.number`

* `rv_expected_sig_to_noise` `[float32]` - Expected signal-to-noise ratio in the combination of the spectra used to obtain the radial velocity
    * `ucd: stat.snr`

* `rv_renormalised_gof` `[float32]` - Radial velocity renormalised goodness of fit
    * `ucd: stat.fit.goodness`

* `rv_chisq_pvalue` `[float32]` - P-value for constancy based on a chi-squared criterion
    * `ucd: stat.fit.param`

* `rv_time_duration` `[float32|d]` - Time coverage of the radial velocity time series
    * `ucd: time.duration`

* `rv_amplitude_robust` `[float32|km.s**-1]` - Total amplitude in the radial velocity time series after outlier removal
    * `ucd: stat.error;spect.dopplerVeloc.opt;em.opt.I`

* `rv_template_teff` `[float32|K]` - Teff of the template used to compute the radial velocity
    * `ucd: stat.fit.param`

* `rv_template_logg` `[float32|log(cm.s**-2)]` - Logg of the template used to compute the radial velocity
    * `ucd: stat.fit.param`

* `rv_template_fe_h` `[float32|dex]` - \[Fe/H] of the template used to compute the radial velocity
    * `ucd: stat.fit.param`

* `rv_atm_param_origin` `[int16]` - Origin of the atmospheric parameters associated to the template
    * `ucd: meta.code.class`

* `vbroad` `[float32|km.s**-1]` - Spectral line broadening parameter
    * `ucd: spect.dopplerVeloc.opt;em.opt.I`

* `vbroad_error` `[float32|km.s**-1]` - Uncertainty on the spectral line broadening
    * `ucd: stat.error;spect.dopplerVeloc.opt;em.opt.I`

* `vbroad_nb_transits` `[int16]` - Number of transits used to compute vbroad
    * `ucd: meta.number`

* `grvs_mag` `[float32|mag]` - Integrated Grvs magnitude
    * `ucd: phot.mag;em.opt`

* `grvs_mag_error` `[float32|mag]` - Grvs magnitude uncertainty
    * `ucd: stat.error;phot.mag;em.opt`

* `grvs_mag_nb_transits` `[int16]` - Number of transits used to compute Grvs
    * `ucd: meta.number`

* `rvs_spec_sig_to_noise` `[float32]` - Signal-to-noise ratio in the mean RVS spectrum
    * `ucd: stat.snr`

* `phot_variable_flag` `[string]` - Photometric variability flag
    * `ucd: meta.code;src.var`

* `l` `[float64|deg]` - Galactic longitude
    * `ucd: pos.galactic.lon`

* `b` `[float64|deg]` - Galactic latitude
    * `ucd: pos.galactic.lat`

* `ecl_lon` `[float64|deg]` - Ecliptic longitude
    * `ucd: pos.ecliptic.lon`

* `ecl_lat` `[float64|deg]` - Ecliptic latitude
    * `ucd: pos.ecliptic.lat`

* `in_qso_candidates` `[bool]` - Flag indicating the availability of additional information in the QSO candidates table
    * `ucd: meta.code.status`

* `in_galaxy_candidates` `[bool]` - Flag indicating the availability of additional information in the galaxy candidates table
    * `ucd: meta.code.status`

* `non_single_star` `[int16]` - Flag indicating the availability of additional information in the various Non-Single Star tables
    * `ucd: meta.code.status`

* `has_xp_continuous` `[bool]` - Flag indicating the availability of mean BP/RP spectrum in continuous representation for this source
    * `ucd: xxxxx`

* `has_xp_sampled` `[bool]` - Flag indicating the availability of mean BP/RP spectrum in sampled form for this source
    * `ucd: meta.code.status`

* `has_rvs` `[bool]` - Flag indicating the availability of mean RVS spectrum for this source
    * `ucd: meta.code.status`

* `has_epoch_photometry` `[bool]` - Flag indicating the availability of epoch photometry for this source
    * `ucd: meta.code.status`

* `has_epoch_rv` `[bool]` - Flag indicating the availability of epoch radial velocity for this source
    * `ucd: meta.code.status`

* `has_mcmc_gspphot` `[bool]` - Flag indicating the availability of GSP-Phot MCMC samples for this source
    * `ucd: meta.code.status`

* `has_mcmc_msc` `[bool]` - Flag indicating the availability of MSC MCMC samples for this source
    * `ucd: meta.code.status`

* `in_andromeda_survey` `[bool]` - Flag indicating that the source is present in the Gaia Andromeda Photometric Survey (GAPS)
    * `ucd: meta.code.status`

* `classprob_dsc_combmod_quasar` `[float32]` - Probability from DSC-Combmod of being a quasar (data used: BP/RP spectrum, photometry, astrometry)
    * `ucd: stat.probability`

* `classprob_dsc_combmod_galaxy` `[float32]` - Probability from DSC-Combmod of being a galaxy (data used: BP/RP spectrum, photometry, astrometry)
    * `ucd: stat.probability`

* `classprob_dsc_combmod_star` `[float32]` - Probability from DSC-Combmod of being a single star (but not a white dwarf) (data used: BP/RP spectrum, photometry, astrometry)
    * `ucd: stat.probability`

* `teff_gspphot` `[float32|K]` - Effective temperature from GSP-Phot Aeneas best library using BP/RP spectra
    * `ucd: phys.temperature.effective`

* `teff_gspphot_lower` `[float32|K]` - Lower confidence level (16%) of effective temperature from GSP-Phot Aeneas best library using BP/RP spectra
    * `ucd: phys.temperature.effective;stat.min`

* `teff_gspphot_upper` `[float32]` - Upper confidence level (84%) of effective temperature from GSP-Phot Aeneas best library using BP/RP spectra
    * `ucd: phys.temperature.effective;stat.max`

* `logg_gspphot` `[float32|log(cm.s**-2)]` - Surface gravity from GSP-Phot Aeneas best library using BP/RP spectra
    * `ucd: phys.gravity`

* `logg_gspphot_lower` `[float32|log(cm.s**-2)]` - Lower confidence level (16%) of surface gravity from GSP-Phot Aeneas best library using BP/RP spectra
    * `ucd: phys.gravity;stat.min`

* `logg_gspphot_upper` `[float32|log(cm.s**-2)]` - Upper confidence level (84%) of surface gravity from GSP-Phot Aeneas best library using BP/RP spectra
    * `ucd: phys.gravity;stat.max`

* `mh_gspphot` `[float32|dex]` - Iron abundance from GSP-Phot Aeneas best library using BP/RP spectra
    * `ucd: phys.abund.Z`

* `mh_gspphot_lower` `[float32|dex]` - Lower confidence level (16%) of iron abundance from GSP-Phot Aeneas best library using BP/RP spectra
    * `ucd: phys.abund.Z;stat.min`

* `mh_gspphot_upper` `[float32|dex]` - Upper confidence level (84%) of iron abundance from GSP-Phot Aeneas best library using BP/RP spectra
    * `ucd: phys.abund.Z;stat.max`

* `distance_gspphot` `[float32|pc]` - Distance from GSP-Phot Aeneas best library using BP/RP spectra
    * `ucd: pos.distance;pos.eq`

* `distance_gspphot_lower` `[float32|pc]` - Lower confidence level (16%) of distance from GSP-Phot Aeneas best library using BP/RP spectra
    * `ucd: pos.distance;pos.eq`

* `distance_gspphot_upper` `[float32|pc]` - Upper confidence level (84%) of distance from GSP-Phot Aeneas best library using BP/RP spectra
    * `ucd: pos.distance;pos.eq`

* `azero_gspphot` `[float32|mag]` - Monochromatic extinction $A_0$ at 547.7nm from GSP-Phot Aeneas best library using BP/RP spectra
    * `ucd: phys.absorption;em.opt`

* `azero_gspphot_lower` `[float32|mag]` - Lower confidence level (16%) of monochromatic extinction $A_0$ at 547.7nm from GSP-Phot Aeneas best library using BP/RP spectra
    * `ucd: phys.absorption;em.opt`

* `azero_gspphot_upper` `[float32|mag]` - Upper confidence level (84%) of monochromatic extinction $A_0$ at 547.7nm from GSP-Phot Aeneas best library using BP/RP spectra
    * `ucd: phys.absorption;em.opt`

* `ag_gspphot` `[float32|mag]` - Extinction in G band from GSP-Phot Aeneas best library using BP/RP spectra
    * `ucd: phys.absorption;em.opt`

* `ag_gspphot_lower` `[float32|mag]` - Lower confidence level (16%) of extinction in G band from GSP-Phot Aeneas best library using BP/RP spectra
    * `ucd: phys.absorption;em.opt`

* `ag_gspphot_upper` `[float32|mag]` - Upper confidence level (84%) of extinction in G band from GSP-Phot Aeneas best library using BP/RP spectra
    * `ucd: phys.absorption;em.opt`

* `ebpminrp_gspphot` `[float32|mag]` - Reddening $E(G_{\\rm BP} - G_{\\rm RP})$ from GSP-Phot Aeneas best library using BP/RP spectra
    * `ucd: phot.color.excess`

* `ebpminrp_gspphot_lower` `[float32|mag]` - Lower confidence level (16%) of reddening  $E(G_{\\rm BP} - G_{\\rm RP})$ from GSP-Phot Aeneas best library using BP/RP spectra
    * `ucd: phot.color.excess;stat.min`

* `ebpminrp_gspphot_upper` `[float32|mag]` - Upper confidence level (84%) of reddening  $E(G_{\\rm BP} - G_{\\rm RP})$ from GSP-Phot Aeneas best library using BP/RP spectra
    * `ucd: phot.color.excess;stat.max`

* `libname_gspphot` `[string]` - Name of library that achieves the highest mean log-posterior in MCMC samples and was used to derive GSP-Phot parameters in this table
    * `ucd: meta.note`


Example CSV entries
-------------------

**Horizontal**

| solution_id         | designation            | source_id   | random_index | ref_epoch | ra                 | ra_error    | dec                  | dec_error   | parallax           | parallax_error | parallax_over_error | pm        | pmra               | pmra_error  | pmdec               | pmdec_error | ra_dec_corr | ra_parallax_corr | ra_pmra_corr | ra_pmdec_corr | dec_parallax_corr | dec_pmra_corr | dec_pmdec_corr | parallax_pmra_corr | parallax_pmdec_corr | pmra_pmdec_corr | astrometric_n_obs_al | astrometric_n_obs_ac | astrometric_n_good_obs_al | astrometric_n_bad_obs_al | astrometric_gof_al | astrometric_chi2_al | astrometric_excess_noise | astrometric_excess_noise_sig | astrometric_params_solved | astrometric_primary_flag | nu_eff_used_in_astrometry | pseudocolour | pseudocolour_error | ra_pseudocolour_corr | dec_pseudocolour_corr | parallax_pseudocolour_corr | pmra_pseudocolour_corr | pmdec_pseudocolour_corr | astrometric_matched_transits | visibility_periods_used | astrometric_sigma5d_max | matched_transits | new_matched_transits | matched_transits_removed | ipd_gof_harmonic_amplitude | ipd_gof_harmonic_phase | ipd_frac_multi_peak | ipd_frac_odd_win | ruwe      | scan_direction_strength_k1 | scan_direction_strength_k2 | scan_direction_strength_k3 | scan_direction_strength_k4 | scan_direction_mean_k1 | scan_direction_mean_k2 | scan_direction_mean_k3 | scan_direction_mean_k4 | duplicated_source | phot_g_n_obs | phot_g_mean_flux  | phot_g_mean_flux_error | phot_g_mean_flux_over_error | phot_g_mean_mag | phot_bp_n_obs | phot_bp_mean_flux  | phot_bp_mean_flux_error | phot_bp_mean_flux_over_error | phot_bp_mean_mag | phot_rp_n_obs | phot_rp_mean_flux | phot_rp_mean_flux_error | phot_rp_mean_flux_over_error | phot_rp_mean_mag | phot_bp_rp_excess_factor | phot_bp_n_contaminated_transits | phot_bp_n_blended_transits | phot_rp_n_contaminated_transits | phot_rp_n_blended_transits | phot_proc_mode | bp_rp     | bp_g       | g_rp       | radial_velocity | radial_velocity_error | rv_method_used | rv_nb_transits | rv_nb_deblended_transits | rv_visibility_periods_used | rv_expected_sig_to_noise | rv_renormalised_gof | rv_chisq_pvalue | rv_time_duration | rv_amplitude_robust | rv_template_teff | rv_template_logg | rv_template_fe_h | rv_atm_param_origin | vbroad | vbroad_error | vbroad_nb_transits | grvs_mag  | grvs_mag_error | grvs_mag_nb_transits | rvs_spec_sig_to_noise | phot_variable_flag | l                  | b                   | ecl_lon            | ecl_lat             | in_qso_candidates | in_galaxy_candidates | non_single_star | has_xp_continuous | has_xp_sampled | has_rvs | has_epoch_photometry | has_epoch_rv | has_mcmc_gspphot | has_mcmc_msc | in_andromeda_survey | classprob_dsc_combmod_quasar | classprob_dsc_combmod_galaxy | classprob_dsc_combmod_star | teff_gspphot | teff_gspphot_lower | teff_gspphot_upper | logg_gspphot | logg_gspphot_lower | logg_gspphot_upper | mh_gspphot | mh_gspphot_lower | mh_gspphot_upper | distance_gspphot | distance_gspphot_lower | distance_gspphot_upper | azero_gspphot | azero_gspphot_lower | azero_gspphot_upper | ag_gspphot | ag_gspphot_lower | ag_gspphot_upper | ebpminrp_gspphot | ebpminrp_gspphot_lower | ebpminrp_gspphot_upper | libname_gspphot |
|---------------------|------------------------|-------------|--------------|-----------|--------------------|-------------|----------------------|-------------|--------------------|----------------|---------------------|-----------|--------------------|-------------|---------------------|-------------|-------------|------------------|--------------|---------------|-------------------|---------------|----------------|--------------------|---------------------|-----------------|----------------------|----------------------|---------------------------|--------------------------|--------------------|---------------------|--------------------------|------------------------------|---------------------------|--------------------------|---------------------------|--------------|--------------------|----------------------|-----------------------|----------------------------|------------------------|-------------------------|------------------------------|-------------------------|-------------------------|------------------|----------------------|--------------------------|----------------------------|------------------------|---------------------|------------------|-----------|----------------------------|----------------------------|----------------------------|----------------------------|------------------------|------------------------|------------------------|------------------------|-------------------|--------------|-------------------|------------------------|-----------------------------|-----------------|---------------|--------------------|-------------------------|------------------------------|------------------|---------------|-------------------|-------------------------|------------------------------|------------------|--------------------------|---------------------------------|----------------------------|---------------------------------|----------------------------|----------------|-----------|------------|------------|-----------------|-----------------------|----------------|----------------|--------------------------|----------------------------|--------------------------|---------------------|-----------------|------------------|---------------------|------------------|------------------|------------------|---------------------|--------|--------------|--------------------|-----------|----------------|----------------------|-----------------------|--------------------|--------------------|---------------------|--------------------|---------------------|-------------------|----------------------|-----------------|-------------------|----------------|---------|----------------------|--------------|------------------|--------------|---------------------|------------------------------|------------------------------|----------------------------|--------------|--------------------|--------------------|--------------|--------------------|--------------------|------------|------------------|------------------|------------------|------------------------|------------------------|---------------|---------------------|---------------------|------------|------------------|------------------|------------------|------------------------|------------------------|-----------------|
| 1636148068921376768 | "Gaia DR3 4295806720"  | 4295806720  | 545300884    | 2016.0    | 44.99615537864534  | 0.10161827  | 0.005615226341865997 | 0.10133387  | 0.3543305595550248 | 0.12266381     | 2.8886316           | 12.616485 | 11.93835156938502  | 0.13794228  | -4.0806193394130865 | 0.13316983  | 0.12293493  | 0.13202813       | -0.08891027  | 0.022551458   | -0.3653421        | -0.03690377   | -0.24483804    | 0.06301233         | 0.13570854          | 0.3343367       | 184                  | 0                    | 183                       | 1                        | 2.6720488          | 242.20697           | 0.3806193                | 2.0765078                    | 31                        | "False"                  | 1.5089388                 | null         | null               | null                 | null                  | null                       | null                   | null                    | 22                           | 16                      | 0.21780181              | 22               | 9                    | 0                        | 0.01759732                 | 90.23934               | 0                   | 0                | 1.1429516 | 0.30795118                 | 0.19765861                 | 0.43010107                 | 0.8420776                  | -87.75478              | -30.69455              | -46.20191              | 30.174356              | "False"           | 182          | 1653.39471645947  | 2.0757642              | 796.5234                    | 17.641426       | 18            | 800.4295459066461  | 12.601409               | 63.51905                     | 18.080235        | 20            | 1187.588003883822 | 15.823832               | 75.0506                      | 17.061232        | 1.2023853                | 0                               | 0                          | 0                               | 2                          | 0              | 1.0190029 | 0.43880844 | 0.5801945  | null            | null                  | null           | null           | null                     | null                       | null                     | null                | null            | null             | null                | null             | null             | null             | null                | null   | null         | null               | null      | null           | null                 | null                  | "NOT_AVAILABLE"    | 176.95107618038946 | -48.901520870941965 | 42.53372584780011  | -16.32957416215404  | "False"           | "False"              | 0               | "True"            | "False"        | "False" | "False"              | "False"      | "True"           | "True"       | "False"             | 3.0354892E-11                | 7.0457914E-13                | 0.9999876                  | 5052.976     | 5040.658           | 5066.6284          | 4.7793       | 4.7613             | 4.7924             | -1.4592    | -1.5732          | -1.3439          | 1497.0547        | 1466.7346              | 1536.1321              | 0.0064        | 0.0016              | 0.0176              | 0.0052     | 0.0013           | 0.0143           | 0.0028           | 7.0E-4                 | 0.0078                 | "MARCS"         |
| 1636148068921376768 | "Gaia DR3 34361129088" | 34361129088 | 894504938    | 2016.0    | 45.00432028915398  | 0.09731972  | 0.021047763781174733 | 0.101752974 | 3.235017271512856  | 0.12045025     | 26.857704           | 35.230515 | 29.518344127131527 | 0.13369285  | 19.231654938806578  | 0.13392176  | 0.16325329  | 6.428645E-4      | -0.073663116 | -0.012016551  | -0.40389284       | -0.10152152   | -0.31593448    | 0.14065048         | 0.23142646          | 0.38175407      | 172                  | 0                    | 171                       | 1                        | 1.081467           | 194.59933           | 0.26741344               | 1.0328022                    | 31                        | "False"                  | 1.285487                  | null         | null               | null                 | null                  | null                       | null                   | null                    | 20                           | 15                      | 0.22053866              | 20               | 9                    | 0                        | 0.05737302                 | 84.542816              | 0                   | 0                | 1.0578898 | 0.28431648                 | 0.18242157                 | 0.4234895                  | 0.8483561                  | -101.856606            | -31.586445             | -44.381237             | 29.909302              | "False"           | 170          | 1763.191386728999 | 2.1212356              | 831.2096                    | 17.571619       | 18            | 389.99713585371074 | 9.491409                | 41.089485                    | 18.86089         | 19            | 2178.214858374066 | 15.074686               | 144.49487                    | 16.402643        | 1.4565701                | 0                               | 2                          | 0                               | 1                          | 0              | 2.4582462 | 1.2892704  | 1.1689758  | null            | null                  | null           | null           | null                     | null                       | null                     | null                | null            | null             | null                | null             | null             | null             | null                | null   | null         | null               | null      | null           | null                 | null                  | "NOT_AVAILABLE"    | 176.94278852482034 | -48.88493355232444  | 42.54657309907107  | -16.317212317623884 | "False"           | "False"              | 0               | "False"           | "False"        | "False" | "False"              | "False"      | "True"           | "True"       | "False"             | 1.0820195E-13                | 5.682676E-13                 | 0.9993886                  | 3478.5408    | 3461.1475          | 3497.5784          | 4.7          | 4.6405             | 4.7734             | -0.6143    | -0.7064          | -0.4964          | 302.2347         | 292.5325               | 312.6373               | 0.7643        | 0.7292              | 0.7975              | 0.505      | 0.4815           | 0.5273           | 0.3096           | 0.2956                 | 0.3228                 | "MARCS"         |
| 1636148068921376768 | "Gaia DR3 38655544960" | 38655544960 | 1757259052   | 2016.0    | 45.004978371745516 | 0.017885398 | 0.019879675701858644 | 0.01877158  | 3.1391701154499523 | 0.022347411    | 140.47131           | 35.30821  | 29.686339048921702 | 0.023771733 | 19.115199913956804  | 0.023830384 | 0.1152631   | 0.07323115       | -0.10691941  | -0.03021361   | -0.4488658        | -0.15551351   | -0.37927917    | 0.18184616         | 0.26367012          | 0.35528076      | 183                  | 0                    | 182                       | 1                        | 0.26434276         | 181.43846           | 0.0                      | 0.0                          | 31                        | "False"                  | 1.4550159                 | null         | null               | null                 | null                  | null                       | null                   | null                    | 21                           | 15                      | 0.03929549              | 21               | 9                    | 0                        | 0.024301996                | 98.629005              | 0                   | 0                | 1.012191  | 0.30656147                 | 0.20578752                 | 0.45299426                 | 0.84656596                 | -96.31889              | -34.497215             | -44.82578              | 30.34742               | "False"           | 180          | 42030.60043942405 | 11.392837              | 3689.213                    | 14.128453       | 20            | 17955.47937733753  | 26.03932                | 689.55255                    | 14.70305         | 19            | 34263.48754002838 | 36.75135                | 932.30554                    | 13.410816        | 1.2424035                | 0                               | 3                          | 0                               | 2                          | 0              | 1.2922335 | 0.5745964  | 0.71763706 | 41.187176       | 3.1130338             | 2              | 10             | 1                        | 8                          | 7.034563                 | null                | null            | 749.9199         | null                | 4500.0           | 3.0              | -0.25            | 111                 | null   | null         | null               | 13.068616 | 0.049816404    | 10                   | null                  | "NOT_AVAILABLE"    | 176.94476211452783 | -48.88527012426483  | 42.546872019115916 | -16.318521975182243 | "False"           | "False"              | 0               | "True"            | "True"         | "False" | "False"              | "False"      | "True"           | "True"       | "False"             | 1.03982646E-13               | 5.193881E-13                 | 0.9998059                  | 4708.7944    | 4659.062           | 4723.2773          | 4.5588       | 4.5261             | 4.5654             | -0.087     | -0.1218          | -0.0681          | 332.8322         | 330.4709               | 347.1729               | 0.2345        | 0.184               | 0.2516              | 0.182      | 0.1425           | 0.1955           | 0.0961           | 0.0752                 | 0.1032                 | "MARCS"         | 

**Vertical**


* `solution_id` | `1636148068921376768`
* `designation` | `Gaia DR3 4295806720`
* `source_id` | `4295806720`
* `random_index` | `545300884`
* `ref_epoch` | `2016.0`
* `ra` | `44.99615537864534`
* `ra_error` | `0.10161827`
* `dec` | `0.005615226341865997`
* `dec_error` | `0.10133387`
* `parallax` | `0.3543305595550248`
* `parallax_error` | `0.12266381`
* `parallax_over_error` | `2.8886316`
* `pm` | `12.616485`
* `pmra` | `11.93835156938502`
* `pmra_error` | `0.13794228`
* `pmdec` | `-4.0806193394130865`
* `pmdec_error` | `0.13316983`
* `ra_dec_corr` | `0.12293493`
* `ra_parallax_corr` | `0.13202813`
* `ra_pmra_corr` | `-0.08891027`
* `ra_pmdec_corr` | `0.022551458`
* `dec_parallax_corr` | `-0.3653421`
* `dec_pmra_corr` | `-0.03690377`
* `dec_pmdec_corr` | `-0.24483804`
* `parallax_pmra_corr` | `0.06301233`
* `parallax_pmdec_corr` | `0.13570854`
* `pmra_pmdec_corr` | `0.3343367`
* `astrometric_n_obs_al` | `184`
* `astrometric_n_obs_ac` | `0`
* `astrometric_n_good_obs_al` | `183`
* `astrometric_n_bad_obs_al` | `1`
* `astrometric_gof_al` | `2.6720488`
* `astrometric_chi2_al` | `242.20697`
* `astrometric_excess_noise` | `0.3806193`
* `astrometric_excess_noise_sig` | `2.0765078`
* `astrometric_params_solved` | `31`
* `astrometric_primary_flag` | `"False"`
* `nu_eff_used_in_astrometry` | `1.5089388`
* `pseudocolour` | `null`
* `pseudocolour_error` | `null`
* `ra_pseudocolour_corr` | `null`
* `dec_pseudocolour_corr` | `null`
* `parallax_pseudocolour_corr` | `null`
* `pmra_pseudocolour_corr` | `null`
* `pmdec_pseudocolour_corr` | `null`
* `astrometric_matched_transits` | `22`
* `visibility_periods_used` | `16`
* `astrometric_sigma5d_max` | `0.21780181`
* `matched_transits` | `22`
* `new_matched_transits` | `9`
* `matched_transits_removed` | `0`
* `ipd_gof_harmonic_amplitude` | `0.01759732`
* `ipd_gof_harmonic_phase` | `90.23934`
* `ipd_frac_multi_peak` | `0`
* `ipd_frac_odd_win` | `0`
* `ruwe` | `1.1429516`
* `scan_direction_strength_k1` | `0.30795118`
* `scan_direction_strength_k2` | `0.19765861`
* `scan_direction_strength_k3` | `0.43010107`
* `scan_direction_strength_k4` | `0.8420776`
* `scan_direction_mean_k1` | `-87.75478`
* `scan_direction_mean_k2` | `-30.69455`
* `scan_direction_mean_k3` | `-46.20191`
* `scan_direction_mean_k4` | `30.174356`
* `duplicated_source` | `"False"`
* `phot_g_n_obs` | `182`
* `phot_g_mean_flux` | `1653.39471645947`
* `phot_g_mean_flux_error` | `2.0757642`
* `phot_g_mean_flux_over_error` | `796.5234`
* `phot_g_mean_mag` | `17.641426`
* `phot_bp_n_obs` | `18`
* `phot_bp_mean_flux` | `800.4295459066461`
* `phot_bp_mean_flux_error` | `12.601409`
* `phot_bp_mean_flux_over_error` | `63.51905`
* `phot_bp_mean_mag` | `18.080235`
* `phot_rp_n_obs` | `20`
* `phot_rp_mean_flux` | `1187.588003883822`
* `phot_rp_mean_flux_error` | `15.823832`
* `phot_rp_mean_flux_over_error` | `75.0506`
* `phot_rp_mean_mag` | `17.061232`
* `phot_bp_rp_excess_factor` | `1.2023853`
* `phot_bp_n_contaminated_transits` | `0`
* `phot_bp_n_blended_transits` | `0`
* `phot_rp_n_contaminated_transits` | `0`
* `phot_rp_n_blended_transits` | `2`
* `phot_proc_mode` | `0`
* `bp_rp` | `1.0190029`
* `bp_g` | `0.43880844`
* `g_rp` | `0.5801945`
* `radial_velocity` | `null`
* `radial_velocity_error` | `null`
* `rv_method_used` | `null`
* `rv_nb_transits` | `null`
* `rv_nb_deblended_transits` | `null`
* `rv_visibility_periods_used` | `null`
* `rv_expected_sig_to_noise` | `null`
* `rv_renormalised_gof` | `null`
* `rv_chisq_pvalue` | `null`
* `rv_time_duration` | `null`
* `rv_amplitude_robust` | `null`
* `rv_template_teff` | `null`
* `rv_template_logg` | `null`
* `rv_template_fe_h` | `null`
* `rv_atm_param_origin` | `null`
* `vbroad` | `null`
* `vbroad_error` | `null`
* `vbroad_nb_transits` | `null`
* `grvs_mag` | `null`
* `grvs_mag_error` | `null`
* `grvs_mag_nb_transits` | `null`
* `rvs_spec_sig_to_noise` | `null`
* `phot_variable_flag` | `"NOT_AVAILABLE"`
* `l` | `176.95107618038946`
* `b` | `-48.901520870941965`
* `ecl_lon` | `42.53372584780011`
* `ecl_lat` | `-16.32957416215404`
* `in_qso_candidates` | `"False"`
* `in_galaxy_candidates` | `"False"`
* `non_single_star` | `0`
* `has_xp_continuous` | `"True"`
* `has_xp_sampled` | `"False"`
* `has_rvs` | `"False"`
* `has_epoch_photometry` | `"False"`
* `has_epoch_rv` | `"False"`
* `has_mcmc_gspphot` | `"True"`
* `has_mcmc_msc` | `"True"`
* `in_andromeda_survey` | `"False"`
* `classprob_dsc_combmod_quasar` | `3.0354892E-11`
* `classprob_dsc_combmod_galaxy` | `7.0457914E-13`
* `classprob_dsc_combmod_star` | `0.9999876`
* `teff_gspphot` | `5052.976`
* `teff_gspphot_lower` | `5040.658`
* `teff_gspphot_upper` | `5066.6284`
* `logg_gspphot` | `4.7793`
* `logg_gspphot_lower` | `4.7613`
* `logg_gspphot_upper` | `4.7924`
* `mh_gspphot` | `-1.4592`
* `mh_gspphot_lower` | `-1.5732`
* `mh_gspphot_upper` | `-1.3439`
* `distance_gspphot` | `1497.0547`
* `distance_gspphot_lower` | `1466.7346`
* `distance_gspphot_upper` | `1536.1321`
* `azero_gspphot` | `0.0064`
* `azero_gspphot_lower` | `0.0016`
* `azero_gspphot_upper` | `0.0176`
* `ag_gspphot` | `0.0052`
* `ag_gspphot_lower` | `0.0013`
* `ag_gspphot_upper` | `0.0143`
* `ebpminrp_gspphot` | `0.0028`
* `ebpminrp_gspphot_lower` | `7.0E-4`
* `ebpminrp_gspphot_upper` | `0.0078`
* `libname_gspphot` | `"MARCS"`
