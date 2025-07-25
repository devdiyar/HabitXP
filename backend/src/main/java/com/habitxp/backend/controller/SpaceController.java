package com.habitxp.backend.controller;

import com.habitxp.backend.dto.UpdateSpaceRequest;
import com.habitxp.backend.model.Space;
import com.habitxp.backend.service.SpaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/spaces")
@RequiredArgsConstructor
public class SpaceController {

    private final SpaceService spaceService;

    @GetMapping
    public ResponseEntity<List<Space>> getSpacesByUser(Authentication auth) {
        String userId = auth.getName();
        return ResponseEntity.ok(spaceService.getSpacesByUser(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Space> getSpace(@PathVariable String id) {
        return spaceService.getSpaceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Space> createSpace(@RequestBody Space space, Authentication auth) {
        space.setUserId(auth.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(spaceService.createSpace(space));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Space> updateSpace(@PathVariable String id, @RequestBody UpdateSpaceRequest updatedSpace) {
        Space updated = spaceService.updateSpaceColorKey(id, updatedSpace);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSpace(@PathVariable String id) {
        spaceService.deleteSpace(id);
        return ResponseEntity.noContent().build();
    }
}
