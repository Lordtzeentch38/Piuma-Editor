#[tauri::command]
fn open_external_url(url: String) -> Result<(), String> {
  #[cfg(target_os = "windows")]
  {
    use std::os::windows::process::CommandExt;
    std::process::Command::new("cmd")
      .args(["/c", "start", "", &url])
      .creation_flags(0x08000000) // CREATE_NO_WINDOW
      .spawn()
      .map_err(|e| e.to_string())?;
  }
  #[cfg(not(target_os = "windows"))]
  {
    let _ = std::process::Command::new("open").arg(&url).spawn();
  }
  Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_log::Builder::default().build())
    .invoke_handler(tauri::generate_handler![open_external_url])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
