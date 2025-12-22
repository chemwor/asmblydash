import { useState } from "react";

const BrandPackagingPreferences: React.FC = () => {
  // State for form fields
  const [brandName, setBrandName] = useState<string>("");
  const [supportEmail, setSupportEmail] = useState<string>("");
  const [packagingInsertNote, setPackagingInsertNote] = useState<string>("");
  const [returnAddress, setReturnAddress] = useState<string>("");
  const [defaultPackingSlipStyle, setDefaultPackingSlipStyle] = useState<string>("Minimal");
  const [requirePhotoProof, setRequirePhotoProof] = useState<boolean>(false);
  const [allowMaterialSubstitution, setAllowMaterialSubstitution] = useState<boolean>(false);

  // Logo upload state
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");

  // Handle logo file change
  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  // Handle logo removal
  const handleRemoveLogo = () => {
    setSelectedLogo(null);
    setLogoPreview("");
  };

  // Handle toggle changes
  const handleToggleChange = (field: string, value: boolean) => {
    if (field === 'requirePhotoProof') {
      setRequirePhotoProof(value);
    } else if (field === 'allowMaterialSubstitution') {
      setAllowMaterialSubstitution(value);
    }
  };

  // Handle save changes with toast notification
  const handleSaveChanges = () => {
    // Show toast notification (placeholder - no actual toast library found)
    alert("Brand & Packaging Preferences saved successfully!");
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px]">
          <h5 className="!text-lg !mb-[6px]">Brand & Packaging Preferences</h5>
          <p className="mb-0">
            Configure your brand identity and packaging requirements.
          </p>
        </div>

        <form>
          <div className="sm:grid sm:grid-cols-2 sm:gap-[25px]">
            {/* Brand Name */}
            <div className="mb-[20px] sm:mb-0">
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Brand Name
              </label>
              <input
                type="text"
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                placeholder="Enter your brand name"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
              />
            </div>

            {/* Support Email */}
            <div className="mb-[20px] sm:mb-0">
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Support Email
              </label>
              <input
                type="email"
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                placeholder="support@yourbrand.com"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
              />
            </div>

            {/* Default Packing Slip Style */}
            <div className="mb-[20px] sm:mb-0">
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Default Packing Slip Style
              </label>
              <select
                className="h-[55px] rounded-md border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[13px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500 text-black dark:text-white"
                value={defaultPackingSlipStyle}
                onChange={(e) => setDefaultPackingSlipStyle(e.target.value)}
              >
                <option value="Minimal">Minimal</option>
                <option value="Branded">Branded</option>
                <option value="None">None</option>
              </select>
            </div>

            {/* Packaging Insert Note */}
            <div className="sm:col-span-2 mb-[20px] sm:mb-0">
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Packaging Insert Note
              </label>
              <textarea
                className="h-[140px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] p-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                placeholder="Add a personal note to include with shipments..."
                value={packagingInsertNote}
                onChange={(e) => setPackagingInsertNote(e.target.value)}
              />
            </div>

            {/* Return Address */}
            <div className="sm:col-span-2 mb-[20px] sm:mb-0">
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Return Address
              </label>
              <textarea
                className="h-[140px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] p-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                placeholder="Enter your complete return address..."
                value={returnAddress}
                onChange={(e) => setReturnAddress(e.target.value)}
              />
            </div>
          </div>

          {/* Logo Upload Section */}
          <h5 className="!text-lg !mb-[6px] !mt-[20px] md:!mt-[25px]">Brand Logo</h5>
          <p className="mb-[20px] md:mb-[25px]">
            Upload your brand logo for packaging and documentation.
          </p>

          <div id="logoUploader">
            <div className="relative flex items-center justify-center overflow-hidden rounded-md py-[88px] px-[20px] border border-gray-200 dark:border-[#172036]">
              <div className="flex items-center justify-center">
                <div className="w-[35px] h-[35px] border border-gray-100 dark:border-[#15203c] flex items-center justify-center rounded-md text-primary-500 text-lg ltr:mr-[12px] rtl:ml-[12px]">
                  <i className="ri-upload-2-line"></i>
                </div>
                <p className="leading-[1.5]">
                  <strong className="text-black dark:text-white">
                    Click to upload logo
                  </strong>
                  <br /> SVG, PNG, JPG (max 2MB)
                </p>
              </div>
              <input
                type="file"
                id="logoInput"
                accept="image/*,.svg"
                className="absolute top-0 left-0 right-0 bottom-0 rounded-md z-[1] opacity-0 cursor-pointer"
                onChange={handleLogoChange}
              />
            </div>

            {/* Logo Preview */}
            {logoPreview && (
              <div className="mt-[10px] flex items-center gap-4">
                <div className="relative w-[80px] h-[80px] border border-gray-200 dark:border-[#172036] rounded-md p-2 bg-white dark:bg-[#0c1427]">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="w-full h-full object-contain rounded"
                  />
                  <button
                    type="button"
                    className="absolute top-[-5px] right-[-5px] bg-orange-500 text-white w-[20px] h-[20px] flex items-center justify-center rounded-full text-xs"
                    onClick={handleRemoveLogo}
                  >
                    ✕
                  </button>
                </div>
                <div>
                  <p className="text-black dark:text-white font-medium mb-1">{selectedLogo?.name}</p>
                  <p className="text-gray-500 text-sm">
                    {selectedLogo && (selectedLogo.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Toggle Settings */}
          <h5 className="!text-lg !mb-[20px] !mt-[20px] md:!mt-[25px]">
            Shipping Preferences
          </h5>

          <div className="space-y-4">
            {/* Require Photo Proof Toggle */}
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-[#172036] rounded-md">
              <div>
                <label className="text-black dark:text-white font-medium">
                  Require photo proof before shipping
                </label>
                <p className="text-gray-500 text-sm mt-1">
                  Request makers to provide photos before shipping products
                </p>
              </div>
              <div
                className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors ${
                  requirePhotoProof ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-600'
                }`}
                onClick={() => handleToggleChange('requirePhotoProof', !requirePhotoProof)}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    requirePhotoProof ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </div>
            </div>

            {/* Allow Material Substitution Toggle */}
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-[#172036] rounded-md">
              <div>
                <label className="text-black dark:text-white font-medium">
                  Allow makers to substitute material if needed
                </label>
                <p className="text-gray-500 text-sm mt-1">
                  Permit makers to use alternative materials when original is unavailable
                </p>
              </div>
              <div
                className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors ${
                  allowMaterialSubstitution ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-600'
                }`}
                onClick={() => handleToggleChange('allowMaterialSubstitution', !allowMaterialSubstitution)}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    allowMaterialSubstitution ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-[20px] md:mt-[25px]">
            <button
              type="button"
              className="font-medium inline-block transition-all rounded-md md:text-md py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-primary-500 text-white hover:bg-primary-400"
              onClick={handleSaveChanges}
            >
              <span className="inline-block relative ltr:pl-[29px] rtl:pr-[29px]">
                <i className="material-symbols-outlined ltr:left-0 rtl:right-0 absolute top-1/2 -translate-y-1/2">
                  save
                </i>
                Save Changes
              </span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default BrandPackagingPreferences;
